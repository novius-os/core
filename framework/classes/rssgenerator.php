<?
namespace Nos;
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS NAME      : RSS_GENERATOR                                                                        //
// LANGUAGE        : PHP                                                                                  //
// LANGUAGE VERSION: 5.0                                                                                  //
// AUTHOR          : Julien PACHET                                                                        //
// EMAIL           : j|u|l|i|e|n| [@] |p|a|c|h|e|t|.|c|o|m                                                //
// VERSION         : 1.0                                                                                  //
// DATE            : 10/09/2005                                                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// History:                                                                                               //
// class based from php class easy-rss                                                                    //
//   by Paulius Lescinskas (http://www.phpclasses.org/browse/package/1820.html)                           //
// -------                                                                                                //
//  Date        Version   Actions                                                                         //
// ------------------------------------------------------------------------------------------------------ //
//  10/09/2005  0.9       Tested version                                                                  //
//  10/09/2005  1.0       Prod version                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// What the class need:                                                                                   //
// * Nothing                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// What the class do:                                                                                     //
// * Generate RSS feed from array of items                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Declaration                                                                                            //
// -----------                                                                                            //
// rss_generator($title)                                                                                  //
//   magic function __get                                                                                 //
//   magic function __set                                                                                 //
//   get($items)                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

class RssGenerator {

    private $_encoding="UTF-8";
    private $_title="";
    private $_language="en-us";
    private $_description="";
    private $_link="";
    private $_generator="rss_generator on Novius-OS";
    private $_version="2.0";

    public function __construct($title) {
        $this->_title=$title;
    }
    public function __get($name) {
        if ($name=='encoding')		return $this->_encoding;
        if ($name=='title')		return $this->_title;
        if ($name=='language')		return $this->_language;
        if ($name=='description')	return $this->_description;
        if ($name=='generator')		return $this->_generator;
        if ($name=='link')		return $this->_link;
    }
    public function __set($name,$value) {
        if ($name=='encoding')		$this->_encoding=stripslashes($value);
        if ($name=='title')		$this->_title=stripslashes($value);
        if ($name=='language')		$this->_language=stripslashes(static::toRssLanguageCode($value));
        if ($name=='description')	$this->_description=stripslashes($value);
        if ($name=='generator')		$this->_generator=stripslashes($value);
        if ($name=='link')		$this->_link=stripslashes($value);

    }

    /**
    Make an xml document of the rss stream
    @param: items: n row of associative array with theses field:
    'title': title of the item
    'description': short description of the item
    'pubData': publication timestamp of the item
    'link': url to show the item
    @result: xml document of rss stream
     **/
    public function get($items) {
        $res ="";
        // header
        $res.="<rss version=\"2.0\">\n";
        $res.="\t<channel>\n";
        $res.="\t\t<title><![CDATA[".$this->_title."]]></title>\n";
        $res.="\t\t<description><![CDATA[".$this->_description."]]></description>\n";
        $res.="\t\t<link>".$this->_link."</link>\n";
        //$res.="\t\t<atom:link href=\"$this->_link\" rel=\"self\" type=\"application/rss+xml\"/>\n";
        $res.="\t\t<language>".$this->_language."</language>\n";
        $res.="\t\t<generator>".$this->_generator."</generator>\n";
        //items
        foreach($items as $item) {
            //$date = date("r", stripslashes($item["pubDate"]));
            $res.="\t\t<item>\n";
            $res.="\t\t\t<title><![CDATA[".stripslashes($item["title"])."]]></title>\n";
            $res.="\t\t\t<description><![CDATA[".stripslashes($item["description"])."]]></description>\n";
            if (!empty($item["pubDate"]))
                $res.="\t\t\t<pubDate>".date("r", stripslashes($item["pubDate"]))."</pubDate>\n";
            if (!empty($item["link"]))
                $res.="\t\t\t<link>".stripslashes($item["link"])."</link>\n";
            $res.="\t\t\t<guid>".$this->_link."</guid>\n";
            $res.="\t\t</item>\n";
        }
        //footer
        $res.="\t</channel>\n";
        $res.="</rss>\n";
        return $res;
    }

    public function getFromNuggets($items) {
        $rss_list = array();
        foreach ($items as $item) {
            $content = $item->get_nugget_content('rss_item');
            $rss_item = array();
            if (isset($content[\Nos\DataCatcher::TYPE_TITLE])) {
                $rss_item['title'] = $content[\Nos\DataCatcher::TYPE_TITLE];
            }
            if (isset($content[\Nos\DataCatcher::TYPE_URL])) {
                $rss_item['link'] = \Uri::base(false).$content[\Nos\DataCatcher::TYPE_URL];
            }
            if (isset($content[\Nos\DataCatcher::TYPE_IMAGE])) {
                $rss_item['img'] = \Uri::base(false).$content[\Nos\DataCatcher::TYPE_IMAGE];
            }
            if (isset($content[\Nos\DataCatcher::TYPE_TEXT])) {
                $rss_item['description'] = $content[\Nos\DataCatcher::TYPE_TEXT];
            }
            $rss_list[] = $rss_item;
        }

        return $this->get($rss_list);
    }

    public static function toRssLanguageCode($code) {
        return str_replace('_', '-', \Str::lower($code));
    }
}
