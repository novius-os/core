<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Oil;

class Console extends \Oil\Console
{

    public function __construct()
    {
        error_reporting(E_ALL | E_STRICT);

        ini_set("error_log", null);
        ini_set("log_errors", 1);
        ini_set("html_errors", 0);
        ini_set("display_errors", 0);

        while (ob_get_level()) {
            ob_end_clean();
        }

        ob_implicit_flush(true);

        // And, go!
        self::main();
    }

    private function main()
    {
        \Cli::write(
            sprintf(
                'Fuel %s - PHP %s (%s) (%s) [%s]',
                \Fuel::VERSION,
                phpversion(),
                php_sapi_name(),
                self::build_date(),
                PHP_OS
            )
        );

        // Loop until they break it
        while (true) {
            if (\Cli::$readline_support) {
                readline_completion_function(array(__CLASS__, 'tab_complete'));
            }

            if (!$__line = rtrim(trim(trim(\Cli::input('>>> ')), PHP_EOL), ';')) {
                continue;
            }

            if ($__line == 'quit') {
                break;
            }

            // Add this line to history
            //$this->history[] = array_slice($this->history, 0, -99) + array($line);
            if (\Cli::$readline_support) {
                readline_add_history($__line);
            }

            if (self::is_immediate($__line)) {
                $__line = "return ($__line)";
            }

            ob_start();

            // Unset the previous line and execute the new one
            $ret = false;
            try {
                $ret = eval("$__line;");
            } catch (Exception $e) {
                $ret = $__line;
            }

            // Error was returned
            if ($ret === false) {
                \Cli::error('Parse Error - '.$__line);
                \Cli::beep();
            }

            if (ob_get_length() == 0) {
                if (is_bool($ret)) {
                    echo $ret ? 'true' : 'false';
                } elseif (is_string($ret)) {
                    echo addcslashes($ret, "\0..\37\177..\377");
                } elseif (!is_null($ret)) {
                    var_dump($ret);
                }
            }

            unset($ret);
            $out = ob_get_contents();
            ob_end_clean();

            if ((mb_strlen($out) > 0) && (mb_substr($out, -1) != PHP_EOL)) {
                $out .= PHP_EOL;
            }

            echo $out;
            unset($out);
        }
    }

    private static function is_immediate($line)
    {
        $skip = array(
            'class',
            'declare',
            'die',
            'echo',
            'exit',
            'for',
            'foreach',
            'function',
            'global',
            'if',
            'include',
            'include_once',
            'print',
            'require',
            'require_once',
            'return',
            'static',
            'switch',
            'unset',
            'while'
        );

        $okeq = array('===', '!==', '==', '!=', '<=', '>=');

        $code = '';
        $sq = false;
        $dq = false;

        for ($i = 0; $i < mb_strlen($line); $i++) {
            $c = $line{$i};
            if ($c == "'") {
                $sq = !$sq;
            } elseif ($c == '"') {
                $dq = !$dq;
            } elseif (($sq) || ($dq) && $c == "\\") {
                ++$i;
            } else {
                $code .= $c;
            }
        }

        $code = str_replace($okeq, '', $code);
        if (strcspn($code, ';{=') != mb_strlen($code)) {
            return false;
        }

        $kw = preg_split("[^a-z0-9_]iu", $code);
        foreach ($kw as $i) {
            if (in_array($i, $skip)) {
                return false;
            }
        }

        return true;
    }

    private static function build_date()
    {
        ob_start();
        phpinfo(INFO_GENERAL);

        $x = ob_get_contents();
        ob_end_clean();

        $x = strip_tags($x);
        $x = explode(PHP_EOL, $x);
        $s = array('Build Date => ', 'Build Date ');

        foreach ($x as $i) {
            foreach ($s as $j) {
                if (mb_substr($i, 0, mb_strlen($j)) == $j) {
                    return trim(mb_substr($i, mb_strlen($j)));
                }
            }
        }

        return '???';
    }
}

/* End of file oil/classes/console.php */
