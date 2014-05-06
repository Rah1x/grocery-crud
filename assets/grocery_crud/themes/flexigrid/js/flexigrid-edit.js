$(function(){

	var save_and_close = false;

	$('.ptogtitle').click(function(){
		if($(this).hasClass('vsble'))
		{
			$(this).removeClass('vsble');
			$('#main-table-box .crudForm').slideDown("slow");
		}
		else
		{
			$(this).addClass('vsble');
			$('#main-table-box .crudForm').slideUp("slow");
		}
	});

	$('.save-and-go-back-button').click(function(){
		save_and_close = true;
		//$('.crudForm').trigger('submit');
        $(this).parent().parent().parent('.crudForm').trigger('submit');
	});

	$('.crudForm').submit(function(){
		var my_crud_form = $(this);

        var FormLoading = $(this).parent().parent().find('.FormLoading');
        var report_error = $(this).parent().parent().find('.report-error');
        var report_success = $(this).parent().parent().find('.report-success');

		$(this).ajaxSubmit({
			url: validation_url,
			dataType: 'json',
			cache: 'false',
			beforeSend: function(){
				$(FormLoading).show(); //"#FormLoading"
			},
			success: function(data){
				$(FormLoading).hide(); //"#FormLoading"
                if(data.success)
				{
					//alert($(this).getAttribute('method'));
                    $(my_crud_form).ajaxSubmit({ //'#crudForm'
						dataType: 'text',
						cache: 'false',
						beforeSend: function(){
							$(FormLoading).show(); //"#FormLoading"
						},
						success: function(result){
							$(FormLoading).fadeOut("slow"); //"#FormLoading"
							data = $.parseJSON( result );
							if(data.success)
							{
                                var data_unique_hash = my_crud_form.closest(".flexigrid").attr("data-unique-hash");

								$('.flexigrid[data-unique-hash='+data_unique_hash+']').find('.ajax_refresh_and_loading').trigger('click');

								if(save_and_close)
								{
									if ($('#save-and-go-back-button').closest('.ui-dialog').length === 0) {
										window.location = data.success_list_url;
									} else {
										$(".ui-dialog-content").dialog("close");
										success_message(data.success_message);
									}

									return true;
								}

								form_success_message(data.success_message, my_crud_form);
							}
							else
							{
								form_error_message(message_update_error, my_crud_form);
							}
						},
						error: function(){
							form_error_message( message_update_error, my_crud_form);
						}
					});
				}
				else
				{
					$('.field_error').each(function(){
						$(this).removeClass('field_error');
					});
					$(report_error).slideUp('fast');
					$(report_error).html(data.error_message);
					$.each(data.error_fields, function(index,value){
						$('input[name='+index+']').addClass('field_error');
					});

					$(report_error).slideDown('normal');
					$(report_success).slideUp('fast').html('');

				}
			},
			error: function(){
				alert( message_update_error );
				$(FormLoading).hide(); //"#FormLoading"

			}
		});
		return false;
	});

	if( $('.cancel-button').closest('.ui-dialog').length === 0 ) {

		$('.cancel-button').click(function()
        {
			//if( $(this).hasClass('back-to-list') || confirm( message_alert_edit_form ) )
			//{
				window.location = list_url;
			//}

			return false;
		});

	}
});
