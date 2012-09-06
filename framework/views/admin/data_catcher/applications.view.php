<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

    $onDemande = false;
    $auto = false;
    foreach ($data_catchers as $catcher_name => $data_catcher) {
        if (isset($data_catcher['onDemand']) && $data_catcher['onDemand'] && !$onDemande) {
            $onDemande = true;
            echo '<div>', htmlspecialchars(__('This item can be shared with the following applications.')) ,'</div>';
            echo '<h4>', htmlspecialchars(__('Click to customise before share:')) ,'</h4>';
        } elseif ((!isset($data_catcher['onDemand']) || !$data_catcher['onDemand']) && !$auto) {
            echo '<div>', htmlspecialchars(__('This item is automatically shared with the following applications.')) ,'</div>';
            echo '<h4>', htmlspecialchars(__('Click to customise what you share:')) ,'</h4>';
            $auto = true;
        }

        if ($auto) {
            $data_catcher['url'] .= '?'.http_build_query(array(
                'model' => $model_name,
                'id'    => $model_id,
                'catcher' => $catcher_name,
             ), '', '&');
        }

        echo '<button class="catcher" data-params="', htmlspecialchars(\Format::forge($data_catcher)->to_json()) ,'" data-nuggets="', htmlspecialchars(\Format::forge($nuggets)->to_json()) ,'">', htmlspecialchars($data_catcher['title']),'</button>';
    }
