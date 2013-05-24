<?php

namespace Nos;

class Orm_Behaviour_Author extends Orm_Behaviour
{
    /**
     * created_by_property
     */
    protected $_properties = array();

    public function before_insert(\Nos\Orm\Model $item)
    {
        if (NOS_ENTRY_POINT != Nos::ENTRY_POINT_ADMIN) {
            return;
        }

        $created_by_property = \Arr::get($this->_properties, 'created_by_property', null);
        if ($created_by_property === null) {
            return;
        }

        $user = \Session::user();
        if (!empty($user)) {
            $item->{$created_by_property} = $user->user_id;
        }
    }

    /* before_save = both before_insert and before_update */
    public function before_save(\Nos\Orm\Model $item)
    {
        if (NOS_ENTRY_POINT != Nos::ENTRY_POINT_ADMIN) {
            return;
        }

        $updated_by_property = \Arr::get($this->_properties, 'updated_by_property', null);
        if ($updated_by_property === null) {
            return;
        }

        $user = \Session::user();
        if (!empty($user)) {
            $item->{$updated_by_property} = $user->user_id;
        }
    }
}
