Ext.define('Cmm.mixin.Menu', function() {

	function show(view, params, config) {
		var content = Ext.getCmp('content');

		var current = null;

		if (Ext.isString(view)) {
			var itemId = view.replace(/\./g, '_');

			var current = content.getComponent(itemId);
			if(!current) {
				Ext.syncRequire(view);
				current = content.add(Ext.create(view, Ext.merge({
					itemId: itemId
				}), config));
			}
			content.getLayout().setActiveItem(current);
		} else {
			current = view;
		}
	}
	
	function popup(view, params, config) {
		var screen = null;

		if (Ext.isString(view)) {

			try {
				if (!Ext.ClassManager.get(view)) {
					var controller = view.replace('.view.', '.controller.');
					Ext.syncRequire(controller);
					App.getApplication()
						.getController(controller);
				}

				screen = Ext.create(view, Ext.merge({
					modal: true
				}, config));

				if (config && config.by) {
					screen.showBy(config.by)
				} else {
					screen.show();
				}
			} catch (e) {
				console.log(e);
				return;
			}
		}

		if (screen.setParams) {
			screen.setParams(params);
		}
	}
	
	function addSearchGrid(view, params, config) {
		var south = Ext.getCmp('south');
		var current = null;
		
		Ext.each(south.getLayout().getLayoutItems(), function(comp) {
			if(comp.layerId == config.layerId) {
				current = comp;
				return false;
			}
		});
		
		if(!current) {
			current = Ext.create(view, config);
			south.add(current);
		}
		
		return current;
	}
	
	function removeSearchGrid(layerId) {
		var south = Ext.getCmp('south');
		var current = null;
		
		Ext.each(south.getLayout().getLayoutItems(), function(comp) {
			if(comp.layerId == layerId) {
				current = comp;
				return false;
			}
		});
		
		if(current) {
			south.remove(current);
			
			if(south.getLayout().getLayoutItems().length == 0) {
				south.collapse();
			}
		}
	}
	
	function findSearchGrid(layerId, title) {
		var south = Ext.getCmp('south');
		var current = null;
		
		Ext.each(south.getLayout().getLayoutItems(), function(comp) {
			if(comp.layerId == layerId) {
				current = comp;
				return false;
			}
		});
		
		if(!current) {
			var view = 'Sgis.view.south.LayerDynamicGrid';
			current = addSearchGrid(view, {}, { layerId : layerId, title : title });
		}
		
		return current;
	}
	
	function showSearchGrid(layerId, title) {
		var current = findSearchGrid(layerId, title);
		if(current) {
			var south = Ext.getCmp('south');
			south.getLayout().setActiveItem(current);
			south.expand();
		}

		return current;
	}

	return {
		show: show,
		popup: popup,
		addSearchGrid: addSearchGrid,
		removeSearchGrid: removeSearchGrid,
		findSearchGrid: findSearchGrid,
		showSearchGrid: showSearchGrid
	};

}());
