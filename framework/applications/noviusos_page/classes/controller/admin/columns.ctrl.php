<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Page;

class Controller_Admin_Columns extends \Nos\Controller_Admin_Application
{
    public function action_index()
    {
        $models = array(
            'Nos\\BlogNews\\Blog\\Model_Category',
            'Nos\\BlogNews\\Blog\\Model_Post',
            'Nos\\BlogNews\\Blog\\Model_Tag',
            'Nos\\Comments\\Model_Comment',
            'Nos\\Form\\Model_Answer',
            'Nos\\Form\\Model_Answer_Field',
            'Nos\\Form\\Model_Field',
            'Nos\\Form\\Model_Form',
            'Nos\\Monkey\\Model_Monkey',
            'Nos\\Monkey\\Model_Species',
            'Nos\\BlogNews\\News\\Model_Category',
            'Nos\\BlogNews\\News\\Model_Post',
            'Nos\\BlogNews\\News\\Model_Tag',
            'Nos\\Slideshow\\Model_Image',
            'Nos\\Slideshow\\Model_Slideshow',
            'Nos\\Media\\Model_Folder',
            'Nos\\Media\\Model_Link',
            'Nos\\Media\\Model_Media',
            'Nos\\Page\\Model_Page',
            'Nos\\User\\Model_Permission',
            'Nos\\User\\Model_Role',
            'Nos\\User\\Model_User',
            'Nos\\Model_Wysiwyg',
            'Nos\\Model_Content_Nuggets',
        );
        $columns = array();
        foreach ($models as $model) {
            $list_columns = \DB::list_columns($model::table(), null, $model::connection());
            array_walk($list_columns, function (&$column_props, $column) {
                $column_props = array_intersect_key($column_props, array(
                    'default' => null,
                    'data_type' => '',
                    'null' => false,
                ));

                if ($column_props['null'] && $column_props['default'] === null) {
                    $column_props['convert_empty_to_null'] = true;
                }
                if (!$column_props['null'] && $column_props['default'] === '0000-00-00 00:00:00') {
                    unset($column_props['default']);
                }
                if (preg_match('/^(tiny|small|medium|big)?int(eger)?/uiD', $column_props['data_type']) && $column_props['default'] !== null) {
                    $column_props['default'] = (int) $column_props['default'];
                }
            });
            $columns[$model] = $list_columns;
        }

        return '<pre>'.preg_replace(
            array('`NULL,`', '`array \(`', '`=>\s+array`'),
            array('null,', 'array(', '=> array'),
            var_export($columns, true)
        ).'</pre>';
    }
}
