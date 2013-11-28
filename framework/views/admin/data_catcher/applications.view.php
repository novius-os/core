<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

\Nos\I18n::current_dictionary('nos::common');

if (isset($nuggets[\Nos\DataCatcher::TYPE_IMAGE])) {
    $image = \Nos\Media\Model_Media::find($nuggets[\Nos\DataCatcher::TYPE_IMAGE]);
    if (empty($image)) {
        unset($nuggets[\Nos\DataCatcher::TYPE_IMAGE]);
    } else {
        $nuggets['media_url'] = \Nos\Tools_Url::encodePath($image->url());
    }
}
if (isset($nuggets[\Nos\DataCatcher::TYPE_URL])) {
    if (strpos($nuggets[\Nos\DataCatcher::TYPE_URL], '::') !== false) {
        list($page_id, $path) = preg_split("/\:\:/", $nuggets[\Nos\DataCatcher::TYPE_URL]);
        if (!empty($path)) {
            $page = \Nos\Page\Model_Page::find($page_id);
            if (empty($page)) {
                unset($nuggets[\Nos\DataCatcher::TYPE_URL]);
            } else {
                $page_path = preg_replace('`'.preg_quote('.html').'$`iUu', '', \Nos\Tools_Url::encodePath($page->url()));
                $nuggets['absolute_url'] = rtrim($page_path, '/').'/'.$path;
            }
        }
    } else {
        $nuggets['absolute_url'] = $nuggets[\Nos\DataCatcher::TYPE_URL];
    }
}

$onDemande = false;
$auto = false;
$one = false;
foreach ($data_catchers as $catcher_name => $data_catcher) {
    if (!is_array($data_catcher['required_data'])) {
        $data_catcher['required_data'] = array();
    }
    $compatible = true;
    foreach ($data_catcher['required_data'] as $type_data) {
        if (empty($nuggets[$type_data])) {
            $compatible = false;
            break;
        }
    }
    if (!$compatible) {
        continue;
    }
    $one = true;

    if (isset($data_catcher['onDemand']) && $data_catcher['onDemand'] && !$onDemande) {
        $onDemande = true;
        echo '<div>', strtr(__('‘{{item}}’ can be shared with the following applications.'), array('{{item}}' => htmlspecialchars($item->title_item()))) ,'</div>';
        echo '<h4>', __('Click to share:') ,'</h4>';
        echo '<small>', __('(Don’t worry, you’ll get a preview first)') ,'</small>';
    } elseif ((!isset($data_catcher['onDemand']) || !$data_catcher['onDemand']) && !$auto) {
        echo '<div>', strtr(__('‘{{item}}’ is automatically shared with the following applications.'), array('{{item}}' => htmlspecialchars($item->title_item()))) ,'</div>';
        echo '<h4>', __('No action required, click to customise:') ,'</h4>';
        $auto = true;
    }

    if ($auto) {
        $data_catcher['url'] .= '?'.http_build_query(array(
                'model' => $model_name,
                'id'    => $model_id,
                'catcher' => $catcher_name,
            ), '', '&');
    }

    echo '<button class="catcher" data-params="', htmlspecialchars(\Format::forge($data_catcher)->to_json()) ,'" data-nuggets="', htmlspecialchars(\Format::forge($nuggets)->to_json()) ,'">', $data_catcher['title'],'</button>';
}

if (!$one) {
    echo '<div>', strtr(__('How sad! ‘{{item}}’ cannot be shared with any application yet. Ask your developer to set up content sharing for you.'), array('{{item}}' => htmlspecialchars($item->title_item()))) ,'</div>';
}
