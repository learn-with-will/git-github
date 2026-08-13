// Prism core + the languages the Git & GitHub lessons use. The commit DAG and
// terminal output use the `text` fence, which Prism leaves unhighlighted.
// `bash` covers git/CLI commands; `diff` renders patches and merge-conflict hunks;
// `yaml` covers GitHub Actions workflows; `ini` covers Git config files
// (.gitconfig); `json` covers config and API payloads.
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-ini';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
