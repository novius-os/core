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

class Permission_Select extends Permission_Driver
{
    protected $choices;

    protected $permissions;

    protected static $data;

    protected function set_options($options = array())
    {
        $this->choices = $options['choices'];
    }

    public function check($role, $key)
    {
        static::_load_permissions($role);
        return isset(static::$data[$role->role_id][$this->application]) && in_array($key, (array) static::$data[$role->role_id][$this->application]);
    }

    public function display($role)
    {
        echo \View::forge('nos::admin/user/permission/driver_select', array(
            'role'        => $role,
            'application' => $this->application,
            'identifier'  => $this->identifier,
            'choices'     => $this->choices,
            'driver'      => $this,
        ), false);
    }

    public function save($role, $data)
    {
        $perms = User\Model_Permission::find('all', array(
            'where' => array(
                array('perm_role_id',     $role->role_id),
                array('perm_application', $this->application),
                array('perm_identifier',  $this->identifier),
            ),
        ));

        // Remove old permissions
        foreach ($perms as $p) {
            $p->delete();
        }

        // Add appropriates one
        foreach ($data as $permitted) {
            $p = new User\Model_Permission();
            $p->perm_role_id     = $role->role_id;
            $p->perm_application = $this->application;
            $p->perm_identifier  = $this->identifier;
            $p->perm_key = $permitted;
            $p->save();
        }
    }

    protected static function _load_permissions($role)
    {
        if (!empty(static::$data[$role->role_id])) {
            return;
        }

        $data = User\Model_Permission::find('all', array(
            'where' => array(
                array('perm_role_id', $role->role_id),
            ),
        ));

        foreach ($data as $d) {
            static::$data[$d->perm_role_id][$d->perm_application][] = $d->perm_key;
        }
    }

}
