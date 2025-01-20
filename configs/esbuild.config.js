const config = 21;

(async () => {
  try {
    const esbuild = require('esbuild');
    const production = process.argv.includes('--production');
    const ctx = await esbuild.context({
      entryPoints: [ 'compiled/extension.js' ],
      bundle: true,
      format: 'cjs',
      minify: production,
      sourcemap: !production,
      sourcesContent: false,
      platform: 'node',
      outfile: 'dist/extension.js',
      external: [ 'vscode' ],
      logLevel: 'silent',
    });
    await ctx.rebuild();
    await ctx.dispose();
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
