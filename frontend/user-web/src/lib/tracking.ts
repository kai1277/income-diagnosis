export function captureTrackingParams() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get('src');
  const cid = params.get('cid');
  if (src) sessionStorage.setItem('flow_source', src);
  if (cid) sessionStorage.setItem('creative_id', cid);
}

export function getTracking() {
  return {
    flow_source: sessionStorage.getItem('flow_source') ?? 'direct',
    creative_id: sessionStorage.getItem('creative_id') ?? '',
  };
}
