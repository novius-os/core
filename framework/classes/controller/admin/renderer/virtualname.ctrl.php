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

class Controller_Admin_Renderer_Virtualname extends Controller_Admin_Crud
{
    /**
     * Handles the AJAX request to generates the virtual name
     */
    public function action_virtualname()
    {
        try {
            // Gets the model
            $model = \Input::post('model');
            if (empty($model)) {
                throw new \Exception(__('No model specified.'));
            }
            if (!class_exists($model)) {
                throw new \Exception(str_replace('{{model}}', $model, __('Model `{{model}}` not found.')));
            }

            // Gets the id
            $id = \Input::post('id');
            if (empty($id)) {
                throw new \Exception('No id specified.');
            }

            // Gets the item or forges an new one
            $item = $this->getModelItem($model, $id);

            // Populates the item
            $this->item = $this->crud_item($id);
            $this->clone = clone $this->item;
            $this->is_new = $this->item->is_new();
            if ($this->is_new) {
                $this->init_item();
            }
            $this->checkPermission($this->is_new ? 'add' : 'edit');

            $fields = $this->fields($this->config['fields']);
            $fieldset = \Fieldset::build_from_config($fields, $this->item, $this->build_from_config());
            $fieldset = $this->fieldset($fieldset);

            \Response::json(array(
                'virtual_name' => $item->virtual_name(),
            ));
        } catch (\Exception $e) {
            \Response::json(array(
                'error' => '',
            ));
        }
    }

    /**
     * Forges a new item of the specified $model or optionally finds the model specified by $id
     *
     * @param $model
     * @param null $id
     * @return mixed
     */
    public function getModelItem($model, $id = null)
    {
        if ($id !== null) {
            $item =  $model::find($id);
            if (!empty($item)) {
                return $item;
            }
        }
        return $model::forge();
    }
}
