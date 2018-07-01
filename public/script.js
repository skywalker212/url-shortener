$('form').on('submit',(e)=>{
  e.preventDefault();
  var url = document.getElementById("url_input").value;
  $.ajax({
    type:'POST',
    url: 'shorturl',
    data: {url},
    success:function(data){
      if(!data.error) $('#shortened').html('shortened: <a href="'+window.location.href+'shorturl/'+data.short_url+'" target="_blank">'+window.location.href+'shorturl/'+data.short_url+'</a>');
      else $('#shortened').html(data.error);
    }
  });
});