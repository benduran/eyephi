export function Analytics() {
  // biome-ignore lint/style/noProcessEnv: needed to determine if we should render the script
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) return null;

  return (
    <script
      data-website-id="16edb034-e99c-4463-a190-492709c59210"
      defer
      src="https://yummy.benduran.com/script.js"
    />
  );
}
