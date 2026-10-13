import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import DxfParser from 'dxf-parser';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Box, 
  Layers, 
  Play, 
  Pause, 
  Grid, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Move,
  FileCode
} from 'lucide-react';
import { MATERIAL_DENSITIES, type CADAnalysisResult } from '../lib/cadAnalyzer';

interface CADViewerProps {
  cadResult: CADAnalysisResult | null;
  rawFile?: File | null;
  material?: string;
  thicknessMm?: number;
  className?: string;
  onModelParsed?: (result: CADAnalysisResult) => void;
}

// Material color and PBR properties mapping
const MATERIAL_SHADERS: Record<string, { color: number; metalness: number; roughness: number }> = {
  'stainless-304': { color: 0xd4d8dd, metalness: 0.85, roughness: 0.22 },
  'stainless-316': { color: 0xced2d6, metalness: 0.88, roughness: 0.20 },
  'cr-steel':      { color: 0x8a929a, metalness: 0.75, roughness: 0.38 },
  'ar400':         { color: 0x5a6068, metalness: 0.80, roughness: 0.45 },
  'alu-6061':      { color: 0xe6ecf2, metalness: 0.65, roughness: 0.30 },
  'alu-7075':      { color: 0xdde3ea, metalness: 0.70, roughness: 0.28 },
  'copper':        { color: 0xc8754b, metalness: 0.88, roughness: 0.25 },
  'brass':         { color: 0xd4af37, metalness: 0.82, roughness: 0.28 },
  'pla':           { color: 0xff5722, metalness: 0.10, roughness: 0.60 },
  'abs':           { color: 0x2b303a, metalness: 0.15, roughness: 0.55 },
  'pc':            { color: 0xe0e6ed, metalness: 0.20, roughness: 0.40 },
  'nylon-pa12':    { color: 0x1e242d, metalness: 0.10, roughness: 0.70 },
};

export const CADViewer: React.FC<CADViewerProps> = ({
  cadResult,
  rawFile,
  material = 'stainless-304',
  thicknessMm = 2.0,
  className = '',
  onModelParsed,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const activeWorkerRef = useRef<Worker | null>(null);
  const currentBoundingRadiusRef = useRef<number>(120);

  // Check if file is 2D DXF
  const is2DMode = Boolean(
    (rawFile && rawFile.name.toLowerCase().endsWith('.dxf')) ||
    (cadResult && cadResult.fileFormat === 'DXF')
  );

  const onModelParsedRef = useRef(onModelParsed);
  useEffect(() => {
    onModelParsedRef.current = onModelParsed;
  }, [onModelParsed]);

  const lastParsedFileSigRef = useRef<string>('');
  const lastDxfDataRef = useRef<{
    widthMm: number;
    lengthMm: number;
    cutLengthMm: number;
    pierceCount: number;
    fileName: string;
    fileSizeKb: number;
  } | null>(null);

  // Viewer state
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'iso' | 'top' | 'front' | 'right'>('iso');
  
  // Real model parsing state
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRealGeometry, setIsRealGeometry] = useState<boolean>(false);
  const [modelStats, setModelStats] = useState<{ triangles: number; parts: number; format: string } | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 industrial studio background
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 200000);
    camera.position.set(220, 180, 260);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls (Rotate, Zoom, Pan)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.8;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.minDistance = 0.5;
    controls.maxDistance = 200000;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(300, 450, 250);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90cdf4, 0.8);
    fillLight.position.set(-250, 300, -250);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffedd5, 0.6);
    rimLight.position.set(0, -200, 300);
    scene.add(rimLight);

    // 6. Ground Grid
    const grid = new THREE.GridHelper(800, 40, 0x00f5d4, 0x334155);
    grid.position.y = -0.5;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 7. Model container group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 8. Animation loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      lastParsedFileSigRef.current = '';
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (activeWorkerRef.current) activeWorkerRef.current.terminate();
      resizeObserver.disconnect();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Configure Controls for 2D vs 3D Mode
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (is2DMode) {
      // PURE 2D MODE: Lock 3D rotation, left-drag pans, mousewheel zooms
      controls.enableRotate = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
      setIsAutoRotating(false);
      setCurrentView('top');

      if (gridHelperRef.current) {
        gridHelperRef.current.rotation.x = Math.PI / 2;
        gridHelperRef.current.position.set(0, 0, -2);
      }
    } else {
      // 3D MODE: Full 3D rotation
      controls.enableRotate = true;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
      if (gridHelperRef.current) {
        gridHelperRef.current.rotation.x = 0;
      }
    }
  }, [is2DMode]);

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current && !is2DMode) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating, is2DMode]);

  // Update Grid Visibility
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Safely dispose 3D object hierarchies
  const clearModelGroup = () => {
    lastParsedFileSigRef.current = '';
    const modelGroup = modelGroupRef.current;
    if (!modelGroup) return;

    modelGroup.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });

    while (modelGroup.children.length > 0) {
      modelGroup.remove(modelGroup.children[0]);
    }
    modelGroup.position.set(0, 0, 0);
    modelGroup.rotation.set(0, 0, 0);
  };

  // Fits camera to bounded object
  const fitCameraToBox = useCallback((box: THREE.Box3, force2D = false) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    const radius = Math.max(sphere.radius, 10);
    currentBoundingRadiusRef.current = radius;
    const distance = radius * 2.5;

    const camera = cameraRef.current;
    camera.near = Math.max(0.1, radius * 0.005);
    camera.far = Math.max(100000, radius * 25);
    camera.updateProjectionMatrix();

    controlsRef.current.minDistance = Math.max(0.5, radius * 0.02);
    controlsRef.current.maxDistance = Math.max(50000, radius * 20);

    if (force2D || is2DMode) {
      // PURE 2D TOP-DOWN VIEW (directly facing flat XY sheet)
      camera.position.set(0, 0, distance * 1.5);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(distance * 0.75, distance * 0.65, distance * 0.85);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [is2DMode]);

  // Camera presets
  const setCameraView = (view: 'iso' | 'top' | 'front' | 'right') => {
    setCurrentView(view);
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const dist = (currentBoundingRadiusRef.current || 120) * 2.6;

    if (is2DMode || view === 'top') {
      if (is2DMode) {
        camera.position.set(0, 0, dist * 1.5);
      } else {
        camera.position.set(0, dist * 1.5, 0.001);
      }
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.up.set(0, 1, 0);
      switch (view) {
        case 'iso':
          camera.position.set(dist * 0.75, dist * 0.65, dist * 0.85);
          break;
        case 'front':
          camera.position.set(0, dist * 0.15, dist * 1.3);
          break;
        case 'right':
          camera.position.set(dist * 1.3, dist * 0.15, 0);
          break;
      }
      camera.lookAt(0, 0, 0);
    }
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // Zoom handlers (relative to current controls target)
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const factor = direction === 'in' ? 0.75 : 1.33;

    const target = controls.target;
    const offset = new THREE.Vector3().subVectors(camera.position, target);
    offset.multiplyScalar(factor);
    camera.position.addVectors(target, offset);
    controls.update();
  };

  const handleResetCamera = () => {
    if (modelGroupRef.current && modelGroupRef.current.children.length > 0) {
      const box = new THREE.Box3().setFromObject(modelGroupRef.current);
      fitCameraToBox(box, is2DMode);
    } else {
      if (is2DMode) {
        setCameraView('top');
      } else {
        setCameraView('iso');
      }
    }
  };

  // Create Standard PBR Material
  const getPbrMaterial = useCallback(() => {
    const matProps = MATERIAL_SHADERS[material] ?? MATERIAL_SHADERS['stainless-304'];
    return new THREE.MeshStandardMaterial({
      color: matProps.color,
      metalness: matProps.metalness,
      roughness: matProps.roughness,
      wireframe: isWireframe,
      side: THREE.DoubleSide,
    });
  }, [material, isWireframe]);

  const getEdgeMaterial = useCallback(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
  }, []);

  // Re-apply materials when material or wireframe changes on existing meshes
  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    if (!modelGroup || modelGroup.children.length === 0 || is2DMode) return;

    const pbrMaterial = getPbrMaterial();
    modelGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = pbrMaterial;
      }
    });
  }, [material, isWireframe, getPbrMaterial, is2DMode]);

  // Main CAD File Parser
  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    if (!modelGroup || !sceneRef.current) return;

    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }

    setErrorMessage(null);

    if (!rawFile) {
      clearModelGroup();
      setIsRealGeometry(false);
      setModelStats(null);
      setIsLoadingModel(false);
      lastParsedFileSigRef.current = '';
      lastDxfDataRef.current = null;
      return;
    }

    const fileSig = `${rawFile.name}_${rawFile.size}_${rawFile.lastModified}`;
    if (lastParsedFileSigRef.current === fileSig && modelGroup.children.length > 0) {
      return; // Already parsed this exact file AND meshes exist in scene!
    }
    lastParsedFileSigRef.current = fileSig;

    const pbrMaterial = getPbrMaterial();
    const edgeMaterial = getEdgeMaterial();
    const fileName = rawFile.name.toLowerCase();

    setIsLoadingModel(true);

    // 1. REAL STEP / STP CAD solid parsing (via OpenCASCADE WASM Web Worker)
    if (fileName.endsWith('.step') || fileName.endsWith('.stp') || fileName.endsWith('.iges') || fileName.endsWith('.igs')) {
      setLoadingMessage(`Tessellating real 3D solid geometry from ${rawFile.name}...`);

      rawFile.arrayBuffer().then((buffer) => {
        try {
          const worker = new Worker('/occt-import-js-worker.js');
          activeWorkerRef.current = worker;

          const format = fileName.endsWith('.iges') || fileName.endsWith('.igs') ? 'iges' : 'step';
          worker.postMessage({ format, buffer }, [buffer]);

          worker.onmessage = (ev) => {
            console.log('[CADViewer] STEP worker onmessage received:', ev.data);
            setIsLoadingModel(false);
            const { success, result, error } = ev.data;
            worker.terminate();
            activeWorkerRef.current = null;

            if (!success || !result || !result.meshes || result.meshes.length === 0) {
              setErrorMessage(error || 'Could not extract 3D CAD mesh from this STEP file.');
              return;
            }

            clearModelGroup();

            let totalTriangles = 0;
            const matProps = MATERIAL_SHADERS[material] ?? MATERIAL_SHADERS['stainless-304'];

            result.meshes.forEach((meshData: any) => {
              const geom = new THREE.BufferGeometry();
              geom.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(meshData.attributes.position.array, 3)
              );

              if (meshData.attributes.normal && meshData.attributes.normal.array?.length) {
                geom.setAttribute(
                  'normal',
                  new THREE.Float32BufferAttribute(meshData.attributes.normal.array, 3)
                );
              } else {
                geom.computeVertexNormals();
              }

              if (meshData.index && meshData.index.array?.length) {
                geom.setIndex(new THREE.BufferAttribute(new Uint32Array(meshData.index.array), 1));
                totalTriangles += meshData.index.array.length / 3;
              } else {
                totalTriangles += meshData.attributes.position.array.length / 9;
              }

              let meshMat: THREE.Material = pbrMaterial;
              if (meshData.color && Array.isArray(meshData.color) && meshData.color.length >= 3) {
                meshMat = new THREE.MeshStandardMaterial({
                  color: new THREE.Color(meshData.color[0], meshData.color[1], meshData.color[2]),
                  metalness: matProps.metalness,
                  roughness: matProps.roughness,
                  wireframe: isWireframe,
                  side: THREE.DoubleSide,
                });
              }

              const threeMesh = new THREE.Mesh(geom, meshMat);
              const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 26), edgeMaterial);
              threeMesh.add(edges);
              modelGroup.add(threeMesh);
            });

            // Center entire assembly at (0,0,0)
            const box = new THREE.Box3().setFromObject(modelGroup);
            const center = new THREE.Vector3();
            box.getCenter(center);
            modelGroup.position.sub(center);
            modelGroup.updateMatrixWorld(true);

            // Ground grid placement directly beneath the part
            const size = new THREE.Vector3();
            box.getSize(size);
            if (gridHelperRef.current) {
              gridHelperRef.current.position.set(0, -size.y / 2 - 1, 0);
              gridHelperRef.current.rotation.x = 0;
            }

            const centeredBox = new THREE.Box3().setFromObject(modelGroup);
            fitCameraToBox(centeredBox, false);

            // Compute exact physical properties (Signed Tetrahedral Volume & Surface Area)
            let totalVolumeMm3 = 0;
            let totalSurfaceAreaMm2 = 0;

            result.meshes.forEach((meshData: any) => {
              const pos = meshData.attributes.position.array;
              const idx = meshData.index?.array;
              if (idx && idx.length >= 3) {
                for (let i = 0; i < idx.length; i += 3) {
                  const i1 = idx[i] * 3, i2 = idx[i + 1] * 3, i3 = idx[i + 2] * 3;
                  const x1 = pos[i1], y1 = pos[i1 + 1], z1 = pos[i1 + 2];
                  const x2 = pos[i2], y2 = pos[i2 + 1], z2 = pos[i2 + 2];
                  const x3 = pos[i3], y3 = pos[i3 + 1], z3 = pos[i3 + 2];

                  totalVolumeMm3 += (x1 * (y2 * z3 - y3 * z2) + x2 * (y3 * z1 - y1 * z3) + x3 * (y1 * z2 - y2 * z1)) / 6;

                  const abx = x2 - x1, aby = y2 - y1, abz = z2 - z1;
                  const acx = x3 - x1, acy = y3 - y1, acz = z3 - z1;
                  const cx = aby * acz - abz * acy;
                  const cy = abz * acx - abx * acz;
                  const cz = abx * acy - aby * acx;
                  totalSurfaceAreaMm2 += Math.sqrt(cx * cx + cy * cy + cz * cz) / 2;
                }
              }
            });

            totalVolumeMm3 = Math.abs(totalVolumeMm3);
            centeredBox.getSize(size);
            const widthMm = Math.max(1, Math.round(size.x));
            const lengthMm = Math.max(1, Math.round(size.y));
            const heightMm = Math.max(1, Math.round(size.z));

            if (totalVolumeMm3 === 0) {
              totalVolumeMm3 = widthMm * lengthMm * heightMm * 0.5;
            }

            const density = MATERIAL_DENSITIES[material] ?? 7.93;
            const calculatedWeightKg = Number(((totalVolumeMm3 * density) / 1000000).toFixed(3));

            setIsRealGeometry(true);
            setModelStats({
              triangles: Math.round(totalTriangles),
              parts: result.meshes.length,
              format: fileName.endsWith('.iges') ? 'IGES CAD Solid' : 'STEP AP203/214 Solid',
            });

            if (onModelParsed) {
              const minDim = Math.min(widthMm, lengthMm, heightMm);
              const isSheetLike = minDim <= 6.0 && (Math.max(widthMm, lengthMm) / minDim > 8);
              onModelParsed({
                fileName: rawFile.name,
                fileFormat: 'STEP',
                fileSizeKb: Math.round(rawFile.size / 1024),
                boundingBox: { widthMm, lengthMm, heightMm },
                volumeMm3: Math.round(totalVolumeMm3),
                surfaceAreaMm2: Math.round(totalSurfaceAreaMm2),
                calculatedWeightKg: Math.max(0.01, calculatedWeightKg),
                recommendedProcess: isSheetLike ? 'sheet_metal' : 'cnc_machining',
                dfmChecks: {
                  passed: true,
                  issues: [],
                  warnings: [
                    `Tessellated ${result.meshes.length} solid body${result.meshes.length > 1 ? 'ies' : ''} with ${Math.round(totalTriangles).toLocaleString()} triangles`,
                    `Exact solid volume: ${(totalVolumeMm3 / 1000).toFixed(1)} cm³`,
                  ],
                },
              });
            }
          };

          worker.onerror = (err) => {
            setIsLoadingModel(false);
            setErrorMessage('Web Worker error parsing CAD solid: ' + (err.message || 'Unknown error'));
            worker.terminate();
            activeWorkerRef.current = null;
          };
        } catch (err: any) {
          setIsLoadingModel(false);
          setErrorMessage('Failed to initialize CAD kernel: ' + err.message);
        }
      });
      return;
    }

    // 2. REAL STL 3D Mesh Parsing (Binary & ASCII)
    if (fileName.endsWith('.stl')) {
      setLoadingMessage(`Parsing 3D polygon triangles from ${rawFile.name}...`);

      rawFile.arrayBuffer().then((buffer) => {
        try {
          const loader = new STLLoader();
          const geom = loader.parse(buffer);
          geom.computeVertexNormals();
          geom.center();

          clearModelGroup();

          const mesh = new THREE.Mesh(geom, pbrMaterial);
          const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 30), edgeMaterial);
          mesh.add(edges);
          modelGroup.add(mesh);
          modelGroup.updateMatrixWorld(true);

          const box = new THREE.Box3().setFromObject(modelGroup);
          const size = new THREE.Vector3();
          box.getSize(size);
          if (gridHelperRef.current) {
            gridHelperRef.current.position.set(0, -size.y / 2 - 1, 0);
            gridHelperRef.current.rotation.x = 0;
          }
          fitCameraToBox(box, false);

          const triCount = geom.attributes.position ? Math.round(geom.attributes.position.count / 3) : 0;
          setIsRealGeometry(true);
          setModelStats({
            triangles: triCount,
            parts: 1,
            format: 'STL 3D Mesh',
          });
          setIsLoadingModel(false);
        } catch (err: any) {
          setIsLoadingModel(false);
          setErrorMessage('Failed to parse STL mesh: ' + err.message);
        }
      });
      return;
    }

    // 3. REAL OBJ 3D Wavefront Mesh Parsing
    if (fileName.endsWith('.obj')) {
      setLoadingMessage(`Parsing 3D Wavefront entities from ${rawFile.name}...`);

      rawFile.text().then((text) => {
        try {
          const loader = new OBJLoader();
          const obj = loader.parse(text);

          clearModelGroup();

          let totalTriangles = 0;
          let partCount = 0;

          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              partCount++;
              child.material = pbrMaterial;
              child.geometry.computeVertexNormals();
              if (child.geometry.attributes.position) {
                totalTriangles += child.geometry.attributes.position.count / 3;
              }
              const edges = new THREE.LineSegments(new THREE.EdgesGeometry(child.geometry, 30), edgeMaterial);
              child.add(edges);
            }
          });

          const box = new THREE.Box3().setFromObject(obj);
          const center = new THREE.Vector3();
          box.getCenter(center);
          obj.position.sub(center);

          modelGroup.add(obj);
          modelGroup.updateMatrixWorld(true);

          const centeredBox = new THREE.Box3().setFromObject(modelGroup);
          const size = new THREE.Vector3();
          centeredBox.getSize(size);
          if (gridHelperRef.current) {
            gridHelperRef.current.position.set(0, -size.y / 2 - 1, 0);
            gridHelperRef.current.rotation.x = 0;
          }
          fitCameraToBox(centeredBox, false);

          setIsRealGeometry(true);
          setModelStats({
            triangles: Math.round(totalTriangles),
            parts: partCount || 1,
            format: 'OBJ 3D Mesh',
          });
          setIsLoadingModel(false);
        } catch (err: any) {
          setIsLoadingModel(false);
          setErrorMessage('Failed to parse OBJ model: ' + err.message);
        }
      });
      return;
    }

    // 4. PURE 2D DXF Vector Blueprint & Flat Pattern (ONLY 2D, NO 3D EXTRUSION)
    if (fileName.endsWith('.dxf')) {
      setLoadingMessage(`Reading 2D DXF contours & pierce paths from ${rawFile.name}...`);

      rawFile.text().then((text) => {
        try {
          const parser = new DxfParser();
          const dxf = parser.parseSync(text);

          clearModelGroup();

          const { group: dxfGroup, cutLengthMm, pierceCount, widthMm, lengthMm } = create2DDXFGroup(dxf);
          
          modelGroup.add(dxfGroup);
          modelGroup.updateMatrixWorld(true);

          if (gridHelperRef.current) {
            gridHelperRef.current.position.set(0, 0, -2);
            gridHelperRef.current.rotation.x = Math.PI / 2;
          }

          const box = new THREE.Box3().setFromObject(modelGroup);
          // Pure 2D top-down view
          fitCameraToBox(box, true);

          setIsRealGeometry(true);
          setModelStats({
            triangles: 0,
            parts: 1,
            format: `2D DXF Vector Blueprint (${pierceCount} Pierces • ${(cutLengthMm / 1000).toFixed(2)}m Path)`,
          });

          lastDxfDataRef.current = {
            widthMm,
            lengthMm,
            cutLengthMm,
            pierceCount,
            fileName: rawFile.name,
            fileSizeKb: Math.round(rawFile.size / 1024),
          };

          const density = MATERIAL_DENSITIES[material] ?? 7.85;
          const volumeMm3 = widthMm * lengthMm * thicknessMm * 0.85;
          const weightKg = Number(((volumeMm3 * density) / 1000000).toFixed(3));

          onModelParsedRef.current?.({
            fileName: rawFile.name,
            fileFormat: 'DXF',
            fileSizeKb: Math.round(rawFile.size / 1024),
            boundingBox: { widthMm, lengthMm, heightMm: thicknessMm },
            cutLengthMm,
            pierceCount,
            estimatedCutTimeSec: Math.round((cutLengthMm / 60) + (pierceCount * 0.5)),
            volumeMm3: Math.round(volumeMm3),
            surfaceAreaMm2: Math.round(widthMm * lengthMm * 2),
            calculatedWeightKg: Math.max(0.02, weightKg),
            recommendedProcess: 'sheet_metal',
            dfmChecks: {
              passed: true,
              issues: [],
              warnings: [
                `2D Flat Pattern: ${widthMm} × ${lengthMm} mm (Thickness: ${thicknessMm} mm)`,
                `Total cut perimeter: ${(cutLengthMm / 1000).toFixed(2)}m across ${pierceCount} laser pierces`,
              ],
            },
          });

          setIsLoadingModel(false);
        } catch (err: any) {
          setIsLoadingModel(false);
          setErrorMessage('Failed to parse DXF: ' + err.message);
        }
      });
      return;
    }

    setIsLoadingModel(false);
    setErrorMessage('Unsupported CAD file format. Please upload .STEP, .STP, .STL, .OBJ, or .DXF.');
  }, [rawFile, is2DMode]);

  // Dynamically update DXF metadata when user modifies sheet thickness or material without re-parsing
  useEffect(() => {
    if (!lastDxfDataRef.current || !is2DMode || !rawFile) return;
    const dxf = lastDxfDataRef.current;
    const density = MATERIAL_DENSITIES[material] ?? 7.85;
    const volumeMm3 = dxf.widthMm * dxf.lengthMm * thicknessMm * 0.85;
    const weightKg = Number(((volumeMm3 * density) / 1000000).toFixed(3));

    onModelParsedRef.current?.({
      fileName: dxf.fileName,
      fileFormat: 'DXF',
      fileSizeKb: dxf.fileSizeKb,
      boundingBox: { widthMm: dxf.widthMm, lengthMm: dxf.lengthMm, heightMm: thicknessMm },
      cutLengthMm: dxf.cutLengthMm,
      pierceCount: dxf.pierceCount,
      estimatedCutTimeSec: Math.round((dxf.cutLengthMm / 60) + (dxf.pierceCount * 0.5)),
      volumeMm3: Math.round(volumeMm3),
      surfaceAreaMm2: Math.round(dxf.widthMm * dxf.lengthMm * 2),
      calculatedWeightKg: Math.max(0.02, weightKg),
      recommendedProcess: 'sheet_metal',
      dfmChecks: {
        passed: true,
        issues: [],
        warnings: [
          `2D Flat Pattern: ${dxf.widthMm} × ${dxf.lengthMm} mm (Thickness: ${thicknessMm} mm)`,
          `Total cut perimeter: ${(dxf.cutLengthMm / 1000).toFixed(2)}m across ${dxf.pierceCount} laser pierces`,
        ],
      },
    });
  }, [thicknessMm, material, is2DMode, rawFile]);

  // Helper: Sample ARC into 2D points
  const discretizeArc = (center: { x: number; y: number }, radius: number, startAngle: number, endAngle: number, numSegs = 24) => {
    const pts: Array<{ x: number; y: number }> = [];
    let diff = endAngle - startAngle;
    while (diff < 0) diff += Math.PI * 2;
    const step = diff / numSegs;
    for (let i = 0; i <= numSegs; i++) {
      const a = startAngle + step * i;
      pts.push({
        x: center.x + Math.cos(a) * radius,
        y: center.y + Math.sin(a) * radius,
      });
    }
    return pts;
  };

  // Helper: Chain un-ordered line & arc segments into closed loops (bidirectional snapping)
  const chainSegmentsIntoLoops = (segments: Array<{ p1: { x: number; y: number }; p2: { x: number; y: number } }>, eps = 2.5) => {
    const rem = segments.map((s) => ({
      p1: { x: s.p1.x, y: s.p1.y },
      p2: { x: s.p2.x, y: s.p2.y },
    }));
    const loops: Array<Array<{ x: number; y: number }>> = [];

    while (rem.length > 0) {
      const firstSeg = rem.shift()!;
      const chain: Array<{ x: number; y: number }> = [firstSeg.p1, firstSeg.p2];
      let extended = true;

      while (extended) {
        extended = false;
        const head = chain[0];
        const tail = chain[chain.length - 1];

        // 1. Try extending from the tail (end of chain)
        for (let i = 0; i < rem.length; i++) {
          const s = rem[i];
          if (Math.hypot(s.p1.x - tail.x, s.p1.y - tail.y) < eps) {
            chain.push(s.p2);
            rem.splice(i, 1);
            extended = true;
            break;
          } else if (Math.hypot(s.p2.x - tail.x, s.p2.y - tail.y) < eps) {
            chain.push(s.p1);
            rem.splice(i, 1);
            extended = true;
            break;
          }
        }

        if (extended) continue;

        // 2. Try extending from the head (start of chain)
        for (let i = 0; i < rem.length; i++) {
          const s = rem[i];
          if (Math.hypot(s.p2.x - head.x, s.p2.y - head.y) < eps) {
            chain.unshift(s.p1);
            rem.splice(i, 1);
            extended = true;
            break;
          } else if (Math.hypot(s.p1.x - head.x, s.p1.y - head.y) < eps) {
            chain.unshift(s.p2);
            rem.splice(i, 1);
            extended = true;
            break;
          }
        }
      }

      // Check if chain forms a closed contour
      const head = chain[0];
      const tail = chain[chain.length - 1];
      const gap = Math.hypot(head.x - tail.x, head.y - tail.y);

      // A valid closed loop must have at least 3 vertices and endpoints meeting within tolerance
      if (chain.length >= 3 && gap < 4.0) {
        if (gap > 0.001) {
          chain.push({ x: head.x, y: head.y });
        }
        loops.push(chain);
      }
    }

    return loops;
  };

  const calcPolygonArea = (pts: Array<{ x: number; y: number }>) => {
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      a += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
    }
    return Math.abs(a / 2);
  };

  // Helper: Create Pure 2D Flat Sheet Metal Surface + Glowing Vector Cutpaths (NO 3D Extrusion)
  const create2DDXFGroup = (dxf: any): { group: THREE.Group; cutLengthMm: number; pierceCount: number; widthMm: number; lengthMm: number } => {
    const group = new THREE.Group();
    const segments: Array<{ p1: { x: number; y: number }; p2: { x: number; y: number } }> = [];
    const circles: Array<{ x: number; y: number; r: number }> = [];
    const vectorLines: number[] = [];

    let totalCutLength = 0;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    const updateBounds = (x: number, y: number) => {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    };

    if (dxf && dxf.entities && dxf.entities.length > 0) {
      for (const ent of dxf.entities) {
        if (ent.type === 'LINE' && ent.vertices && ent.vertices.length >= 2) {
          const v0 = ent.vertices[0];
          const v1 = ent.vertices[1];
          segments.push({ p1: { x: v0.x, y: v0.y }, p2: { x: v1.x, y: v1.y } });
          updateBounds(v0.x, v0.y);
          updateBounds(v1.x, v1.y);
          totalCutLength += Math.hypot(v1.x - v0.x, v1.y - v0.y);
          vectorLines.push(v0.x, v0.y, 0, v1.x, v1.y, 0);
        } else if ((ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') && ent.vertices && ent.vertices.length >= 2) {
          const v = ent.vertices;
          for (let i = 0; i < v.length - 1; i++) {
            segments.push({ p1: { x: v[i].x, y: v[i].y }, p2: { x: v[i + 1].x, y: v[i + 1].y } });
            updateBounds(v[i].x, v[i].y);
            totalCutLength += Math.hypot(v[i + 1].x - v[i].x, v[i + 1].y - v[i].y);
            vectorLines.push(v[i].x, v[i].y, 0, v[i + 1].x, v[i + 1].y, 0);
          }
          updateBounds(v[v.length - 1].x, v[v.length - 1].y);

          const isClosed = ent.shape || ent.closed || (ent.flags && (ent.flags & 1) === 1);
          if (isClosed) {
            segments.push({ p1: { x: v[v.length - 1].x, y: v[v.length - 1].y }, p2: { x: v[0].x, y: v[0].y } });
            totalCutLength += Math.hypot(v[0].x - v[v.length - 1].x, v[0].y - v[v.length - 1].y);
            vectorLines.push(v[v.length - 1].x, v[v.length - 1].y, 0, v[0].x, v[0].y, 0);
          }
        } else if (ent.type === 'ARC' && ent.center && ent.radius) {
          const arcPts = discretizeArc(ent.center, ent.radius, ent.startAngle, ent.endAngle, 28);
          for (let i = 0; i < arcPts.length - 1; i++) {
            segments.push({ p1: arcPts[i], p2: arcPts[i + 1] });
            updateBounds(arcPts[i].x, arcPts[i].y);
            totalCutLength += Math.hypot(arcPts[i + 1].x - arcPts[i].x, arcPts[i + 1].y - arcPts[i].y);
            vectorLines.push(arcPts[i].x, arcPts[i].y, 0, arcPts[i + 1].x, arcPts[i + 1].y, 0);
          }
          updateBounds(arcPts[arcPts.length - 1].x, arcPts[arcPts.length - 1].y);
        } else if (ent.type === 'CIRCLE' && ent.center && ent.radius) {
          circles.push({ x: ent.center.x, y: ent.center.y, r: ent.radius });
          updateBounds(ent.center.x - ent.radius, ent.center.y - ent.radius);
          updateBounds(ent.center.x + ent.radius, ent.center.y + ent.radius);
          totalCutLength += Math.PI * 2 * ent.radius;

          const circPts = discretizeArc(ent.center, ent.radius, 0, Math.PI * 2, 40);
          for (let i = 0; i < circPts.length - 1; i++) {
            vectorLines.push(circPts[i].x, circPts[i].y, 0, circPts[i + 1].x, circPts[i + 1].y, 0);
          }
        } else if (ent.type === 'SPLINE' && ent.controlPoints && ent.controlPoints.length >= 2) {
          const cp = ent.controlPoints;
          for (let i = 0; i < cp.length - 1; i++) {
            segments.push({ p1: { x: cp[i].x, y: cp[i].y }, p2: { x: cp[i + 1].x, y: cp[i + 1].y } });
            updateBounds(cp[i].x, cp[i].y);
            totalCutLength += Math.hypot(cp[i + 1].x - cp[i].x, cp[i + 1].y - cp[i].y);
            vectorLines.push(cp[i].x, cp[i].y, 0, cp[i + 1].x, cp[i + 1].y, 0);
          }
          updateBounds(cp[cp.length - 1].x, cp[cp.length - 1].y);
        } else if (ent.type === 'ELLIPSE' && ent.center && ent.majorAxisEndPoint) {
          const majorR = Math.hypot(ent.majorAxisEndPoint.x, ent.majorAxisEndPoint.y);
          const minorR = majorR * (ent.axisRatio || 1);
          const rotAngle = Math.atan2(ent.majorAxisEndPoint.y, ent.majorAxisEndPoint.x);
          const numP = 36;
          let prevP: { x: number; y: number } | null = null;
          for (let i = 0; i <= numP; i++) {
            const theta = (i / numP) * Math.PI * 2;
            const ex = Math.cos(theta) * majorR;
            const ey = Math.sin(theta) * minorR;
            const rx = ent.center.x + ex * Math.cos(rotAngle) - ey * Math.sin(rotAngle);
            const ry = ent.center.y + ex * Math.sin(rotAngle) + ey * Math.cos(rotAngle);
            updateBounds(rx, ry);
            if (prevP) {
              segments.push({ p1: prevP, p2: { x: rx, y: ry } });
              vectorLines.push(prevP.x, prevP.y, 0, rx, ry, 0);
              totalCutLength += Math.hypot(rx - prevP.x, ry - prevP.y);
            }
            prevP = { x: rx, y: ry };
          }
        }
      }
    }

    if (minX === Infinity) { minX = -100; maxX = 100; minY = -100; maxY = 100; }
    const widthMm = Math.max(1, Math.round(maxX - minX));
    const lengthMm = Math.max(1, Math.round(maxY - minY));

    // Try chaining segments into closed loops for solid flat pattern
    const loops = chainSegmentsIntoLoops(segments, 2.0);
    loops.sort((a, b) => calcPolygonArea(b) - calcPolygonArea(a));

    if (loops.length > 0 && calcPolygonArea(loops[0]) > 5) {
      try {
        const shape = new THREE.Shape();
        const outer = loops[0];
        shape.moveTo(outer[0].x, outer[0].y);
        for (let i = 1; i < outer.length; i++) {
          shape.lineTo(outer[i].x, outer[i].y);
        }
        shape.closePath();

        for (let i = 1; i < loops.length; i++) {
          const holeLoop = loops[i];
          if (calcPolygonArea(holeLoop) > 0.5) {
            const holePath = new THREE.Path();
            holePath.moveTo(holeLoop[0].x, holeLoop[0].y);
            for (let j = 1; j < holeLoop.length; j++) {
              holePath.lineTo(holeLoop[j].x, holeLoop[j].y);
            }
            holePath.closePath();
            shape.holes.push(holePath);
          }
        }

        for (const c of circles) {
          const holePath = new THREE.Path();
          holePath.absarc(c.x, c.y, c.r, 0, Math.PI * 2, true);
          shape.holes.push(holePath);
        }

        const flat2DGeom = new THREE.ShapeGeometry(shape);
        const sheetMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.6,
          roughness: 0.4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const sheetMesh = new THREE.Mesh(flat2DGeom, sheetMat);
        sheetMesh.position.z = -0.2;
        group.add(sheetMesh);
      } catch (shapeErr) {
        console.warn('[CADViewer] Shape triangulation fallback:', shapeErr);
      }
    }

    // Glowing Laser Cutting Toolpath vectors (2D Vector Lines in XY plane)
    if (vectorLines.length >= 6) {
      const lineGeom = new THREE.BufferGeometry();
      const posArray = new Float32Array(vectorLines);
      lineGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const laserLineMat = new THREE.LineBasicMaterial({
        color: 0x00f5d4, // Vivid Laser Teal
        linewidth: 2,
      });

      const lineMesh = new THREE.LineSegments(lineGeom, laserLineMat);
      lineMesh.position.z = 0.1;
      group.add(lineMesh);
    }

    // Pierce target markers at circle centers
    if (circles.length > 0) {
      const pierceLines: number[] = [];
      const mSize = Math.min(8, Math.max(2, widthMm * 0.02)); // dynamic crosshair size
      circles.forEach((c) => {
        pierceLines.push(c.x - mSize, c.y, 0, c.x + mSize, c.y, 0);
        pierceLines.push(c.x, c.y - mSize, 0, c.x, c.y + mSize, 0);
      });
      const pierceGeom = new THREE.BufferGeometry();
      pierceGeom.setAttribute('position', new THREE.Float32BufferAttribute(pierceLines, 3));

      const pierceMat = new THREE.LineBasicMaterial({ color: 0xff5722, linewidth: 2 });
      const pierceMesh = new THREE.LineSegments(pierceGeom, pierceMat);
      pierceMesh.position.z = 0.3;
      group.add(pierceMesh);
    }

    // Sheet Envelope reference boundary (subtle cyan dashed outline)
    const boundsLines: number[] = [
      minX, minY, 0, maxX, minY, 0,
      maxX, minY, 0, maxX, maxY, 0,
      maxX, maxY, 0, minX, maxY, 0,
      minX, maxY, 0, minX, minY, 0,
    ];
    const boundsGeom = new THREE.BufferGeometry();
    boundsGeom.setAttribute('position', new THREE.Float32BufferAttribute(boundsLines, 3));
    const boundsMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 });
    const boundsMesh = new THREE.LineSegments(boundsGeom, boundsMat);
    boundsMesh.position.z = -0.3;
    group.add(boundsMesh);

    // Center entire DXF assembly at (0, 0, 0) coherently
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    group.children.forEach((c) => {
      c.position.x -= center.x;
      c.position.y -= center.y;
    });
    group.updateMatrixWorld(true);

    const internalCutoutPierces = Math.max(0, loops.length - 1);
    const circlePierces = circles.length;
    const outerCutPierce = (loops.length > 0 || circles.length > 0) ? 1 : 1;
    const pierceCount = circlePierces + internalCutoutPierces + outerCutPierce;

    return {
      group,
      cutLengthMm: Math.round(totalCutLength),
      pierceCount: Math.max(1, pierceCount),
      widthMm,
      lengthMm,
    };
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-2xl ${className}`}>
      
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-xs text-white">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isLoadingModel ? 'bg-amber-400 animate-ping' : isRealGeometry ? (is2DMode ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400 animate-pulse') : 'bg-slate-500'}`} />
          <span className="font-bold tracking-tight text-slate-200">
            {is2DMode ? '2D CAD Laser Studio' : 'Interactive CAD WebGL Studio'}
          </span>
          {isRealGeometry && (
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
              is2DMode 
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {is2DMode ? <FileCode className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
              {is2DMode ? '2D DXF Flat Pattern' : 'Real 3D CAD File'}
            </span>
          )}
          {modelStats && (
            <span className="hidden md:inline px-2 py-0.5 rounded-full bg-orange-500/20 text-[#FF5722] border border-orange-500/30 text-[10px] font-mono">
              {modelStats.format}
            </span>
          )}
          {!rawFile && (
            <span className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 text-[10px] font-mono">
              Awaiting CAD Upload
            </span>
          )}
        </div>

        {/* View Selector: 2D lock vs 3D views */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-[11px]">
          {is2DMode ? (
            <button
              onClick={() => handleResetCamera()}
              className="px-2.5 py-1 rounded font-bold bg-[#FF5722] text-white shadow-xs"
            >
              2D Flat Pattern View
            </button>
          ) : (
            [
              { id: 'iso', label: 'Isometric' },
              { id: 'top', label: 'Top (2D)' },
              { id: 'front', label: 'Front' },
              { id: 'right', label: 'Side' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setCameraView(v.id as any)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  currentView === v.id
                    ? 'bg-[#FF5722] text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v.label}
              </button>
            ))
          )}
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className={`w-full h-[360px] sm:h-[420px] lg:h-[460px] select-none ${
          is2DMode ? 'cursor-move' : 'cursor-grab active:cursor-grabbing'
        }`}
      />

      {/* Loading Overlay */}
      {isLoadingModel && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-200 tracking-wide">{loadingMessage}</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {is2DMode ? 'Extracting 2D Vector Cut Contours & Pierce Coordinates' : 'OpenCASCADE Wasm Kernel Parsing B-Rep Surfaces'}
          </p>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="absolute top-14 left-4 right-4 z-20 p-3 bg-red-950/90 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2 backdrop-blur-md">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Floating Control Toolbar (Bottom Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-slate-300 text-xs">
        
        {/* Turntable Auto-Rotate (Only in 3D Mode) */}
        {!is2DMode ? (
          <>
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause 360° Auto-Rotate' : 'Start 360° Auto-Rotate'}
              className={`p-2 rounded-lg transition-all flex items-center gap-1 text-[11px] font-medium ${
                isAutoRotating ? 'bg-[#FF5722] text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Rotate</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
          </>
        ) : (
          <>
            <div className="px-2 py-1 text-[11px] font-medium text-cyan-400 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5" />
              <span>2D Pan Mode</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
          </>
        )}

        {/* Zoom In */}
        <button
          onClick={() => handleZoom('in')}
          title="Zoom In (Scroll Up)"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom('out')}
          title="Zoom Out (Scroll Down)"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Wireframe (Only in 3D Mode) */}
        {!is2DMode && (
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title="Toggle Wireframe CAD Mesh"
            className={`p-2 rounded-lg transition-colors ${
              isWireframe ? 'bg-orange-500/20 text-[#FF5722] border border-orange-500/30' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
        )}

        {/* Laser Grid */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Machine Bed Grid"
          className={`p-2 rounded-lg transition-colors ${
            showGrid ? 'text-slate-200' : 'text-slate-500 hover:bg-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Reset Camera to Fit */}
        <button
          onClick={handleResetCamera}
          title={is2DMode ? 'Fit 2D Flat Pattern to Screen' : 'Reset Camera & Center Part'}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Floating CAD Measurement Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex flex-col gap-1 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-300 font-mono">
        <div className="flex items-center gap-1.5 text-orange-400 font-bold">
          <Box className="w-3.5 h-3.5" />
          <span>
            {cadResult 
              ? (is2DMode 
                  ? `2D Extents: ${cadResult.boundingBox.widthMm} × ${cadResult.boundingBox.lengthMm} mm` 
                  : `Extents: ${cadResult.boundingBox.widthMm} × ${cadResult.boundingBox.lengthMm} × ${cadResult.boundingBox.heightMm} mm`)
              : 'Extents: Awaiting CAD Upload'}
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          {is2DMode 
            ? 'Left Drag: Pan Sheet • Wheel: Zoom' 
            : 'Left Drag: Rotate • Right Drag: Pan • Wheel: Zoom'}
        </div>
      </div>

    </div>
  );
};

export default CADViewer;
