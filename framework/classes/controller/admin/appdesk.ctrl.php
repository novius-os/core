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

use Asset, Format, Input, Session, View, Uri;

/**
 * The cloud Controller.
 *
 * A basic controller example.  Has examples of how to set the
 * response body and status.
 *
 * @package  app
 * @extends  Controller
 */
class Controller_Admin_Appdesk extends Controller_Admin_Application
{
    public function before()
    {
        parent::before();

        list($application, $file_name) = \Config::configFile(get_called_class());
        $this->config = \Config::mergeWithUser($application.'::'.$file_name, $this->config);

        $this->config['i18n'] = array(
            'addDropDown' => $this->i18n('Select an action'),
            'columns' => $this->i18n('Columns'),
            'showFiltersColumns' => $this->i18n('Filters column header'),
            'visibility' => $this->i18n('Visibility'),
            'settings' => $this->i18n('Settings'),
            'vertical' => $this->i18n('Vertical'),
            'horizontal' => $this->i18n('Horizontal'),
            'hidden' => $this->i18n('Hidden'),
            'item' => $this->i18n('page'),
            'items' => $this->i18n('pages'),
            'showNbItems' => $this->i18n('Showing {{x}} pages out of {{y}}'),
            'showOneItem' => $this->i18n('Show 1 page'),
            'showNoItem' => $this->i18n('No page'),
            'showAll' => $this->i18n('Show all pages'),
            'views' => $this->i18n('Views'),
            'viewGrid' => $this->i18n('Grid'),
            'viewTreeGrid' => $this->i18n('Tree grid'),
            'viewThumbnails' => $this->i18n('Thumbnails'),
            'preview' => $this->i18n('Preview'),
            'loading' => $this->i18n('Loading...'),
            'languages' => $this->i18n('Languages'),
            'search' => $this->i18n('Search'),
        );

        I18n::group('nos::admin/appdesk');
    }

    public function prepare_i18n()
    {
        parent::prepare_i18n();
        I18n::load('nos::admin/appdesk');
        if (empty($this->config['i18n_file'])) {
            $this->config['i18n_file'] = 'nos::admin/appdesk';
        }
    }

    public function i18n($message) {
        return ___($this->config['i18n_file'], $message, ___('nos::admin/appdesk', $message));
    }

    public function action_index($view = null)
    {
        if (empty($view)) {
            $view = \Input::get('view', $this->config['selectedView']);
        }
        $this->config['selectedView'] = $view;

        if (empty($this->config['custom'])) {
            $this->config['custom'] = array(
                'from' => 'default',
            );
        }

        $view = View::forge('admin/appdesk');

        $locales = \Config::get('locales', array());

        $view->set('appdesk', \Format::forge(array_merge(array('locales' => $locales), $this->config))->to_json(), false);

        return $view;
    }

    public function action_json()
    {
        $config = $this->config;
        $where = function($query) use ($config) {
            foreach (\Arr::get($config, 'inputs', array()) as $input => $condition) {
                $value = Input::get('inspectors.'.$input);
                if (is_callable($condition)) {
                    $query = $condition($value, $query);
                }
            }

            $value = Input::get('inspectors.search');
            $condition = $config['search_text'];
            if (!empty($value)) {
                $query->and_where_open();
                foreach ((array) $condition as $field) {
                    if (is_callable($field)) {
                        $query = $field($value, $query);
                    } else {
                        $query->or_where(array($field, 'LIKE', '%'.$value.'%'));
                    }
                }
                $query->and_where_close();
            }

            Filter::apply($query, $config);

            return $query;
        };

        $return = $this->items(array_merge($this->config['query'], array(
            'callback' => array_merge(\Arr::get($this->config['query'], 'callback', array()), array($where)),
            'dataset' => $this->config['dataset'],
            'lang' => Input::get('lang', null),
            'limit' => intval(Input::get('limit', \Arr::get($this->config['query'], 'limit'))),
            'offset' => intval(Input::get('offset', 0)),
        )));

        $json = array(
            'get' => '',
            'query' =>  '',
            'query2' =>  '',
            'offset' => $return['offset'],
            'items' => $return['items'],
            'total' => $return['total'],
        );

        if (\Fuel::$env === \Fuel::DEVELOPMENT) {
            $json['get'] = Input::get();
            $json['query'] = $return['query'];
            $json['query2'] = $return['query2'];
        }
        if (\Input::get('debug') !== null) {
            \Debug::dump($json);
            exit();
        }

        \Response::json($json);
    }

    public function action_tree_json()
    {
        $tree_config = $this->config['tree'];
        $tree_config['id'] =  $this->config['configuration_id'];

        $json = $this->tree($tree_config);

        if (\Fuel::$env === \Fuel::DEVELOPMENT) {
            $json['get'] = Input::get();
        }
        if (\Input::get('debug') !== null) {
            \Debug::dump($json);
            exit();
        }

        \Response::json($json);
    }
}

/* End of file list.php */
