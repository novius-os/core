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

class Tools_RSS
{

    protected $_channel = array(
        'encoding' => 'UTF-8',
        'version' => '2.0',
    );

    protected $_items = array();

    public static function forge($channel = array(), array $items = array())
    {
        if (!is_array($channel)) {
            $channel = array('title' => $channel);
        }
        return new static($channel, $items);
    }

    public function __construct(array $channel = array(), array $items = array())
    {
        $this->_channel = array_merge($this->_channel, $channel);
        $this->_items = $items;
    }

    public function & __get($property)
    {
        if (!array_key_exists($property, $this->_channel)) {
            $this->_channel[$property] = null;
        }

        return $this->_channel[$property];
    }

    public function __set($property, $value)
    {
        return $this->set($property, $value);
    }

    public function set($property, $value = null)
    {
        if (is_array($property)) {
            foreach ($property as $p => $v) {
                $this->set($p, $v);
            }
        } else {
            $this->_channel[$property] = $value;
        }

        return $this;
    }

    public function set_items(array $items)
    {
        $this->_items = $items;

        return $this;
    }

    public function add_item(array $item)
    {
        $this->_items[] = $item;

        return $this;
    }

    public function __toString()
    {
        return $this->build();
    }

    public function build(array $channel = array(), array $items = array())
    {
        if (!empty($channel)) {
            $this->set($channel);
        }
        if (!empty($items)) {
            $this->set_items($items);
        }

        $xml  = '';
        $xml .= '<?xml version="1.0" encoding="'.$this->_channel['encoding'].'"?>'.PHP_EOL;
        $xml .= '<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" version="'.$this->_channel['version'].'">'.PHP_EOL;
        $xml .= '<channel>'.PHP_EOL;
        foreach (array_diff_key($this->_channel, array('encoding' => '', 'version' => '')) as $key => $value) {
            $xml .= static::_tag($key, $value, 1);
        }
        $xml .= PHP_EOL;
        foreach ($this->_items as $item) {
            $xml .= "\t<item>".PHP_EOL;
            if (empty($item['guid']) && !empty($item['link'])) {
                $item['guid'] = $item['link'];
            }
            foreach ($item as $key => $value) {
                $xml .= static::_tag($key, $value, 2);
            }
            $xml .= "\t</item>".PHP_EOL;
        }

        $xml .= '</channel>'.PHP_EOL;
        $xml .= '</rss>'.PHP_EOL;
        return $xml;
    }

    private static function _tag($key, $value, $indent = 0)
    {
        $xml = '';
        $indent = str_repeat("\t", $indent);
        if (is_array($value)) {
            $xml .= $indent.'<'.$key.'>'.PHP_EOL;
            foreach ($value as $sub_key => $sub_value) {
                $xml .= static::_tag($sub_key, $sub_value, $indent + 1);
            }
            $xml .= $indent.'</'.$key.'>'.PHP_EOL;
        } else {
            $xml .= $indent.'<'.$key.'>';
            if ($key === 'pubDate') {
                if (is_a($value, 'Fuel\\Core\\Date')) {
                    $value = $value->get_timestamp();
                } else if (!is_numeric($value)) {
                    $value = strtotime($value);
                }
                $xml .= date('r', $value);
            } else if (htmlspecialchars($value) !== $value) {
                $xml .= '<![CDATA['.$value.']]>';
            } else {
                $xml .= $value;
            }
            $xml .= '</'.$key.'>'.PHP_EOL;
        }
        return $xml;
    }
}
