importScripts('/occt-import-js.js');

let occtPromise = null;

function getOcct() {
  if (!occtPromise) {
    occtPromise = occtimportjs({
      locateFile: function (path) {
        if (path.endsWith('.wasm')) {
          return '/occt-import-js.wasm';
        }
        return path;
      }
    });
  }
  return occtPromise;
}

self.onmessage = async function (ev) {
  try {
    const occt = await getOcct();
    const { format, buffer, params } = ev.data;
    const fileBytes = new Uint8Array(buffer);
    let result;
    if (format === 'step' || format === 'stp') {
      result = occt.ReadStepFile(fileBytes, params || null);
    } else if (format === 'iges' || format === 'igs') {
      result = occt.ReadIgesFile(fileBytes, params || null);
    } else if (format === 'brep') {
      result = occt.ReadBrepFile(fileBytes, params || null);
    } else {
      result = occt.ReadFile(format, fileBytes, params || null);
    }
    self.postMessage({ success: true, result });
  } catch (err) {
    self.postMessage({ success: false, error: err.message || String(err) });
  }
};
