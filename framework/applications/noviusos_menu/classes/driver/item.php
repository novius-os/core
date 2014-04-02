<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2014 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

namespace Nos\Menu;

class Driver_Item {

	// The menu item
	public $item				= null;

	// Configuration
	protected $config			= null;

	protected $children			= null;

	/**
	 * Constructor
	 *
	 * @param null $item
	 * @return Driver_Item $this
	 */
	public function __construct($item = null) {
        // Search the menu if $menu is an ID
        if (is_numeric($item)) {
            $item = Model_Menu_Item::find($item);
        }

		// Set the item
		$this->item = $item;

		// Loads the driver configuration
		$this->config = $this->loadConfig();

		return $this;
	}

    /**
     * Returns item's children forged with their driver
     *
     * @return array
     */
    public function children() {
		if (is_null($this->children)) {

			// Gets item children
			$this->children = $this->item->children();

			// Forge items driver
			foreach ($this->children as $k => $item) {
				// Forge driver with item
				$this->children[$k] = Driver_Item::forge($item);
			}
		}
		return $this->children;
    }

	/**
	 * Builds the item's edit form
	 *
	 * @param string $content
	 * @param array $options
	 * @return string
	 */
	public function form($content = null, $options = array()) {
		if (is_array($content)) {
			$options = $content;
			$content = null;
		}
		return \View::forge('noviusos_menu::driver/form', \Arr::merge($options, array(
			'item'				=> $this->item,
			'content'			=> $content,
			'expander_options'	=> array(
				'allowExpand'		=> true,
				'expanded'			=> true,
			),
		)), false)->render();
	}

	/**u
	 * Displays the item
	 *
	 * @return string|bool
	 */
	public function display() {
		return $this->title();
	}

	/**
	 * Return the item's allowed EAV attributes
	 *
	 * @return array
	 */
	public function attributes() {
		return \Arr::get($this->config, 'attributes', array());
	}

	/**
	 * Item title
	 *
	 * @return string|bool
	 */
	public function title() {
		return !empty($this->item) ? $this->item->mitem_title : false;
	}

	/**
	 * Iem CSS class
	 *
	 * @return string|bool
	 */
	public function cssClass() {
		return !empty($this->item) ? $this->item->mitem_css_class : false;
	}

	/**
	 * Item icon url
	 *
	 * @param bool $absolute Return an absolute URL (default false)
	 * @return null
	 */
	public function icon($absolute = false) {
		return null;
	}

    /**
     * Is this menu item active ?
     *
     * @return bool
     */
    public function active() {
        return false;
    }

    /**
     * Is this menu item published ?
     *
     * @return bool
     */
    public function published() {
        return true; //@todo manage item publish, then $this->item->published();
    }

	/**
	 * Loads and returns the config
	 *
	 * @return array
	 */
	public function loadConfig() {
		if (is_null($this->config)) {
			$this->config = static::getConfig();
		}
		return $this->config;
	}

	/**
	 * Get the driver configuration
	 *
	 * @return array
	 */
	public static function getConfig() {
		// Get current driver configuration
		list($application_name, $config_file) = \Config::configFile(get_called_class());
		$config = \Config::loadConfiguration($application_name, $config_file);
		// Merge with the common configuration
		if (get_called_class() != get_class()) {
			list($application_name, $config_file) = \Config::configFile(get_class());
			$config = \Arr::merge(\Config::loadConfiguration($application_name, $config_file), $config);
		}
		return $config;
	}

	/**
	 * Returned a forged item
	 *
	 * @param null $item
	 * @return Driver
	 */
	public static function forge($item = null) {
		if (empty($item)) {
			return false;
		}
		// Try to build the appropriate driver
		// Only if called statically on this class, eg. Driver::forge()
		if (!empty($item->mitem_driver) && get_called_class() == get_class()) {
			$driver = $item->mitem_driver;
			if (class_exists($driver)) {
				return new $driver($item);
			}
		}
		return new static($item);
	}
}
