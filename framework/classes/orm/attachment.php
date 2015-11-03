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

class Orm_Attachment extends \Orm\Relation
{
    protected $singular = true;

    protected $cascade_save = true;

    protected $cascade_delete = true;

    /**
     * @var  array  The attachment configuration
     */
    protected $attachment_config = array();

    /**
     * @var  array  The attachment
     */
    protected $attachment = null;

    /**
     * @var  array  Cache for Attachment
     */
    static protected $cache = array();

    public function __construct($from, $name, array $config)
    {
        $this->name        = $name;
        $this->model_from  = $from;

        $this->key_from    = array_key_exists('key_from', $config)
            ? (array) $config['key_from'] : $from::primary_key();

        $this->cascade_save    = array_key_exists('cascade_save', $config)
            ? $config['cascade_save'] : $this->cascade_save;
        $this->cascade_delete  = array_key_exists('cascade_delete', $config)
            ? $config['cascade_delete'] : $this->cascade_delete;

        $attachment_config = \Arr::filter_keys($config, array('key_from', 'cascade_save', 'cascade_delete'), true);
        if (empty($attachment_config['dir'])) {
            $attachment_config['dir'] = strtolower(str_ireplace(array('\\', 'model_'), array(DS, ''), $from).DS.$name.DS);
        }
        $this->attachment_config = $attachment_config;
    }

    protected function attached($from)
    {
        reset($this->key_from);
        $attached = '';
        foreach ($this->key_from as $key) {
            $attached .= (empty($attached) ? '' : '-').$from->{$key};
        }
        if (empty($attached)) {
            if (isset($from->{'attachment'.$this->name})) {
                $attached = $from->get('attachment'.$this->name);
            } else {
                $attached = uniqid('temp-id-attachment-');
                $from->set('attachment'.$this->name, $attached);
            }
        }
        return $attached;
    }

    public function get(\Orm\Model $from)
    {
        $attached = $this->attached($from);
        if (isset($from->{'attachment'.$this->name}) && $attached != $from->{'attachment'.$this->name} &&
            !empty(static::$cache[$this->attachment_config['dir'].'::'.$from->{'attachment'.$this->name}])) {

            $attachment = static::$cache[$this->attachment_config['dir'].'::'.$from->{'attachment'.$this->name}];
            unset(static::$cache[$this->attachment_config['dir'].'::'.$from->{'attachment'.$this->name}]);
            unset($from->{'attachment'.$this->name});
            $attachment->setId($attached);
            static::$cache[$this->attachment_config['dir'].'::'.$attached] = $attachment;
        }
        if (empty(static::$cache[$this->attachment_config['dir'].'::'.$attached])) {
            static::$cache[$this->attachment_config['dir'].'::'.$attached] = \Nos\Attachment::forge($this->attached($from), $this->attachment_config);
        }

        return static::$cache[$this->attachment_config['dir'].'::'.$attached];
    }

    public function join($alias_from, $rel_name, $alias_to_nr, $conditions = array())
    {
        return array();
    }

    public function save($model_from, $models_to, $original_model_ids, $parent_saved, $cascade)
    {
        if (!$parent_saved) {
            return;
        }

        $cascade = is_null($cascade) ? $this->cascade_save : (bool) $cascade;
        if ($cascade) {
            $attachment = $this->get($model_from);
            $attachment->save();
        }
    }

    public function delete($model_from, $models_to, $parent_deleted, $cascade)
    {
        if (!$parent_deleted) {
            return;
        }

        $cascade = is_null($cascade) ? $this->cascade_delete : (bool) $cascade;
        if ($cascade) {
            $attachment = $this->get($model_from);
            $attachment->delete();
        }
    }
}
