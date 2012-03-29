<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

return array(
	'models' => array(
		array(
			'model' => 'Cms\Model_Page_Page',
			'order_by' => 'page_title',
			'childs' => array('Cms\Model_Page_Page'),
			'dataset' => array(
				'id' => 'page_id',
				'title' => 'page_title',
			),
		),
	),
	'roots' => array(
		array(
			'model' => 'Cms\Model_Page_Page',
			'where' => array(array('page_parent_id', 'IS', \DB::expr('NULL'))),
			'order_by' => 'page_title',
		),
	),
);