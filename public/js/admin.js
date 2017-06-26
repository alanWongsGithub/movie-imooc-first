(function($) {
	$('.del').click(function(event) {
		var target = $(event.target);
		var id = target.data("id");
		var tr = $('.item-id-' + id)

		$.ajax({
      		url: '/admin/list?id=' + id,
			type: 'DELETE'
		})
		.done(function(results) {
			if (results.success) {
				if (tr.length > 0) {
					tr.remove();
					alert("删除成功！");
					// $('#myModal').modal();				
				}
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	});

})($);