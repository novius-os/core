<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary('nos::common');

return array(
    'actions' => array(
        'share' => array(
            'label' => __('Share'),
            'iconClasses' => 'nos-icon16 nos-icon16-share',
            'action' => array(
                'action' => 'share',
                'data' => array(
                    'model_id' => '{{_id}}',
                    'model_name' => '{{_model}}',
                ),
            ),
            'targets' => array(
                'toolbar-edit' => true,
            ),
            'visible' => array(
                function($params) {
                    $model = get_class($params['item']);
                    return !$params['item']->is_new() && $model::behaviours('Nos\Orm_Behaviour_Sharable', false);
                }
            ),
        ),
    ),
);