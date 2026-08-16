interface Props {
  onRetry: () => void;
}

export function LoadingError({ onRetry }: Props) {
  return (
    <div style={{ textAlign: "center", paddingTop: 24 }}>
      <p className="q-sub">サーバーが起動中です。少々お待ちください。</p>
      <button className="btn-primary" onClick={onRetry}>
        再試行する
      </button>
    </div>
  );
}
