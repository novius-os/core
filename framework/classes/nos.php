<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos;

class Nos
{
    /**
     * @var  string  constant used for when entry point is back-office
     */
    const ENTRY_POINT_ADMIN = 'admin';
    /**
     * @var  string  constant used for when entry point is front-office
     */
    const ENTRY_POINT_FRONT = 'front';
    /**
     * @var  string  constant used for when entry point is 404
     */
    const ENTRY_POINT_404 = '404';
    /**
     * @var  string  constant used for when entry point is install
     */
    const ENTRY_POINT_INSTALL = 'install';

    /**
     * @var  string  The Novius OS entry point
     */
    public static $entry_point = NOS_ENTRY_POINT;

    /**
     * Returns the controller instance from the main request
     *
     * @return Controller | Controller_Front
     */
    public static function main_controller()
    {
        return \Request::main()->controller_instance;
    }

    /**
     * Execute a HMVC request
     *
     * @param string $where  Route for the request
     * @param array $args   The method parameters
     * @throws \Exception|NotFoundException
     * @throws \Exception|FrontIgnoreTemplateException
     * @return string
     */
    public static function hmvc($where, $args = null)
    {
        \Fuel::$profiling && \Profiler::console("HMVC $where");

        if (!empty($args['args']) && is_array($args['args'])) {
            $args = $args['args'];
            \Log::deprecated(
                'The second argument of Nos::hmvc() containing an "args" key is deprecated, '.
                'you can now directly passed the array of parameters for the request.'.
                'Dubrovka'
            );
        }

        ob_start();
        try {
            $request = \Request::forge($where);

            $response = $request->execute($args);

            echo $response;
        } catch (FrontIgnoreTemplateException $e) {
            throw $e;
        } catch (NotFoundException $e) {
            throw $e;
        } catch (\Exception $e) {
            if (\Fuel::$env == \Fuel::DEVELOPMENT) {
                \Debug::dump('Error when executing HMVC request "'.$where.'"');
                $old_continue_on = \Config::get('errors.continue_on', array());
                $continue_on = $old_continue_on;
                $continue_on[] = $e->getCode();
                \Config::set('errors.continue_on', $continue_on);
                \Error::show_php_error($e);
                $backtrace = \Debug::local_backtrace(true);
                $profiled = array();
                for ($i = 0; $i < count($backtrace); $i++) {
                    $profiled[] = $backtrace[$i]['file'].'@'.$backtrace[$i]['line'];
                }
                \Debug::dump($profiled);

                \Config::set('errors.continue_on', $old_continue_on);
            }
            \Log::exception($e, 'HMVC - ');
            \Fuel::$profiling && \Console::logError($e, "HMVC request '$where' failed.");
        }
        $content = ob_get_clean();

        return $content;
    }

    public static function parse_wysiwyg($content)
    {
        \Log::deprecated('Nos::parse_wysiwyg() is deprecated, use Tools_Wysiwyg::parse() instead.', 'E version');
        return Tools_Wysiwyg::parse($content);
    }

    public static function parse_enhancers($content, $closure)
    {
        \Log::deprecated(
            'Nos::parse_enhancers() is deprecated, use Tools_Wysiwyg::parseEnhancers() instead.',
            'E version'
        );
        Tools_Wysiwyg::parseEnhancers($content, $closure);
    }

    public static function get_enhancer_content($enhancer, $args)
    {
        \Log::deprecated(
            'Nos::get_enhancer_content() is deprecated, use Tools_Enhancer::content() instead.',
            'E version'
        );
        return Tools_Enhancer::content($enhancer, $args);
    }
}
