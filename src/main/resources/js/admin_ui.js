ko.observableArray.fn.subscribeArrayChanged = function(addCallback, deleteCallback) {
    var previousValue = undefined;
    this.subscribe(function(_previousValue) {
        previousValue = _previousValue.slice(0);
    }, undefined, 'beforeChange');
    this.subscribe(function(latestValue) {
        var editScript = ko.utils.compareArrays(previousValue, latestValue);
        for (var i = 0, j = editScript.length; i < j; i++) {
            switch (editScript[i].status) {
                case "retained":
                    break;
                case "deleted":
                    if (deleteCallback)
                        deleteCallback(editScript[i].value);
                    break;
                case "added":
                    if (addCallback)
                        addCallback(editScript[i].value);
                    break;
            }
        }
        previousValue = undefined;
    });
};

applyTemplate = function (tmpl, data, $parent) {
    var $fake =$('<div/>'), $el=$('<div/>').appendTo($fake);
	ko.renderTemplate(tmpl, data, {}, $el, 'replaceNode');
	if ($parent) {
		$.extend(data,$parent.data());
		$el_tmp = $fake.children()[0];		// take 'template'-replaced $el
		$parent.empty();
		$parent.append($el_tmp.children);
		$el = $parent;
	}
	else {
	    $el = $($fake.html());
	}
	data.tmpl = tmpl;
	$el.data(data);
	return $el;
}

ko.bindingHandlers.isotope = {
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)  {
	    	var options = valueAccessor() || {},
	          allBindings = allBindingsAccessor(),
	          unwrap = ko.utils.unwrapObservable,
	          dataArray = options.data,
	          selectedArray = options.selectedItems,
	          $container = $(element),
	          instance = $container.isotope(options),
	          tmpl = options.template,
	          clickFn = options.clickOnSelection;

	    	  $container.on('click', '.element', function(){
		    	    var self = $(this);
		    	    clickFn(self);
		      });
	    	  
	    	 dataArray.subscribeArrayChanged(
	    			    function (data) {
	    			    	instance.isotope('insert', applyTemplate(tmpl, data) );
	    			    },
	    			    function (data) {
	    			    	instance.isotope('remove', applyTemplate(tmpl, data) );
	    			    }
	    	  );
	    	 var refreshDataAndLayout = function($el){
			    	applyTemplate(tmpl, $el.data() , $el);
		            $container.isotope('reLayout');
	    	 };
	    	 selectedArray.subscribeArrayChanged(refreshDataAndLayout, refreshDataAndLayout);
	    }	    
};

function _loadRemote (url, handler, dataAttr) {	
    $.ajax({
	        type: 'GET',
	        url: url,							        
	        success: function(data) {	
	            if (''== dataAttr || null == dataAttr)
	            	handler(data);
		       	else
		       		handler(data[dataAttr]);
		     },
	        error: function(data) {	
	        	handler(data);
		    },
	        dataType: 'jsonp'
	    });							    
};
