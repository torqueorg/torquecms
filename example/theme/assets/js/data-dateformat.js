(function () {
  function dateFormat(date) {
    if (!date) {
      return '--.--.----';
    }

    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    return [('0' + day).slice(-2), ('0' + (month + 1)).slice(-2), year].join(
      '.'
    );
  }

  window.onload = function () {
    $('[data-dateformat]').each(function () {
      console.log($(this).data('dateformat'));
      $(this).text(dateFormat($(this).text()));
    });
  };
})();
