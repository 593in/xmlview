/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
var xv_utils = (function(){
	var re_not_xpath = /^[\w\-\:]+$/;
	
	return {
		/**
		 * Creates XPath for specified <code>node</code> element.
		 * If <code>context</code> passed, the XPath will be built up till this
		 * element.
		 * 
		 * @param {Element} node 
		 * @param {Element} [context] 
		 * @return {String}
		 */
		createXPath: function(node, context) {
			var parts = [];
			
			function walk(node){
				var _node = node;
				var name = node.nodeName;
				var count = 1;
				while (node = node.previousSibling) {
					if (node.nodeType == 1 && node.nodeName == name) {
						count++;
					}
				}
				
				parts.unshift(name + '[' + count + ']');
				if (_node.parentNode && _node.parentNode != context && _node.ownerDocument != _node.parentNode)
					walk(_node.parentNode);
			}
			
			walk(node);
			
			return (!context ? '/' : '') + parts.join('/');
		},
		
		/**
		 * Check is passed string looks like XPath
		 * @param {String} str
		 * @return {Boolean}
		 */
		isXPath: function(str) {
			return !re_not_xpath.test(str);
		},
		
		unescapeHTML: function(text) {
			var chars = {
				'&lt;': '<',
				'&gt;': '>',
				'&amp;': '&',
				'&quot;': '"',
				'&apos;': '\''
			};
			
			text = $.trim(text);
			
			return text.replace(/&(lt|gt|amp|apos|quot);/g, function(str) {
				return chars[str];
			});
		},
		
		toXml: function(text) {
			var result = (new DOMParser()).parseFromString(text, 'text/xml');
			
			if (!result || !result.documentElement
					|| result.documentElement.nodeName == 'parsererror'
					|| result.getElementsByTagName('parsererror').length) {
						
				console.log(result);
				throw "<h2>Can’t parse XML document</h2> \n" + $('parsererror', result).html();
			}
			
			return result;
		}
	};
})();