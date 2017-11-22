var BitcoinMainView = function(){};
var sellInputing = false, buyInputing = false;
BitcoinMainView.prototype = {
  view: function() {
    var html = (function() {/*
<div id="orders">
  <div id="orders-container">
    <div id="sell-orders" class="orders-container">
      <h4>Sell Orders</h4>
      <table class="table table-bordered table-condensed">
        <thead>
          <tr>
            <th>Price</th>
            <th>WNC</th>
          </tr>
        </thead>
        <tbody>
          {{for sell_order_list}}
            <tr>
              <tr data-key="{{:id}}">
                <td style="text-align:left;">{{>price}}</td>
                <td style="text-align:left;">{{>wnc}}</td>
              </tr>
            </tr>
          {{/for}}
        </tbody>
      </table>
    </div>

    <div id="buy-orders" class="orders-container">
      <h4>Buy Orders</h4>
      <table class="table table-bordered table-condensed">
        <thead>
          <tr>
            <th>Price</th>
            <th>WNC</th>
          </tr>
        </thead>
        <tbody>
          {{for buy_order_list}}
            <tr>
              <tr data-key="{{:id}}">
                <td style="text-align:left;">{{>price}}</td>
                <td style="text-align:left;">{{>wnc}}</td>
              </tr>
            </tr>
          {{/for}}
        </tbody>
      </table>
    </div>
  </div>
</div>
<div id="bitcoinMain">
  <div id="inputForm">
    <h4>Buy/Sell WNC</h4>
    <div class="section">
      BTC: <input type="number" value="{{:btc_balance}}" readonly id="ip_btc_balance" style="background-color: #eeeeee;">(BTC) - WCN: <input type="number" value="{{:wcn_balance}}" readonly id="ip_wnc_balance" style="background-color: #eeeeee;">(WNC)
    </div>
    <div class="section">
      Bid Price:
      <input id="ip_bid_price" type="number">
      <ul class="hidden suggestion-list" id="bid_price_volume_list">
        {{for bid_price_volume_list}}
          <li id="li-suggest" data-value={{:price}} class="bid-price-list-item" data-volume={{:volume}}>{{>price}} --- {{>volume}}</li>
        {{/for}}
      </ul>
      Buy Volume:
      <input id="ip_buy_volume" type="number" value="{{:buy_volume}}">
      <button id="btnBuy">Buy WNC</button>
    </div>
    <div class="section">
      Ask Price:
      <input id="ip_sell_price" type="number">
      <ul class="hidden suggestion-list" id="sell_price_volume_list">
        {{for sell_price_volume_list}}
          <li id="li-suggest" data-value={{:price}} class="sell-price-list-item" data-volume={{:volume}}>{{>price}} --- {{>volume}}</li>
        {{/for}}
      </ul>
      Sell Volume:
      <input id="ip_sell_volume" type="number" value="{{:sell_volume}}">
      <button id="btnSell">Sell WNC</button>
    </div>
    <div class="section">
      Difference:
      <input id="difference_buy_sell" type="number">
      Notice point:
      <input id="notice_point" value="0.00000000" type="number">
    </div>
  </div>
  <div id="pending-transaction-container">
    <h4>My Pending Transactions</h4>
    <table id="transaction-list-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Price</th>
          <th>WNC</th>
          <th class="action-column">Status</th>
        </tr>
      </thead>
      <tbody id="transaction-body">
        {{for transaction_list}}
          <tr>
            <tr data-key="{{:id}}">
              <td>{{>type}}</td>
              <td style="text-align:left;">{{>price}}</td>
              <td style="text-align:left;">{{>wnc}}</td>
              <td>
                <a data-id="{{:id}}" class="btn btn-xs btn-warning btnCancelOrder" title="Cancel" aria-label="Cancel Order"><i class="fa fa-remove"></i> Cancel</a>
              </td>
            </tr>
          </tr>
        {{/for}}
      </tbody>
    </table>
  </div>
</div>
*/}).toString().match(/\n([\s\S]*)\n/)[1];
    return html;
  },
  setup: function(parent) {
    bitcoinView.reset();
    bitcoinView.template = $.templates(bitcoinView.view());
    parent.append(bitcoinView.template.render(bitcoinView.getData()));
    setInterval(bitcoinView.updateSellBuyPrice, 1000);
    return bitcoinView.data;
  },
  getData: function() {
    var data = bitcoinView.data;
    data.sell_order_list = [];
    data.buy_order_list = [];
    data.btc_balance = parseFloat($("#balance").val()).toFixed(8);
    data.wcn_balance = parseFloat($("#balance2").val()).toFixed(8);
    data.bid_price_volume_list = [];
    $("#marketsell table tbody tr").each(function(index, item){
      var price = parseFloat($(item).find("td").html().replace(",", "")).toFixed(8);
      var volume = parseFloat($(item).find("td").next().html().replace(",", "")).toFixed(8);
      if(data.bid_price_volume_list.length < 5) {
        data.bid_price_volume_list.push({id: index + 1, price: price, price_label: price, volume: volume, volume_label: volume});
      }
      if(data.sell_order_list.length < 10) {
        data.sell_order_list.push({id: index + 1, price: price, wnc: volume});
      }
    });
    // data.bid_price_volume_list.push({id: 0, price: "input", price_label: "Make me feel input", volume: "input", volume_label: "Make me feel input"});
    data.buy_volume = 0.0;

    data.sell_price_volume_list = [];
    $("#marketbuy table tbody tr").each(function(index, item){
      var price = parseFloat($(item).find("td").html().replace(",", "")).toFixed(8);
      var volume = parseFloat($(item).find("td").next().html().replace(",", "")).toFixed(8);
      if(data.sell_price_volume_list.length < 5) {
        data.sell_price_volume_list.push({id: index + 1, price: price, price_label: price, volume: volume, volume_label: volume});
      }
      if(data.buy_order_list.length < 10) {
        data.buy_order_list.push({id: index + 1, price: price, wnc: volume});
      }
    });
    // data.sell_price_volume_list.push({id: 0, price: "input", price_label: "Make me feel input", volume: "input", volume_label: "Make me feel input"});
    data.sell_volume = 0.0;

    // // recheck data
    // if (data.sell_volume < 1) {
    //   data.sell_volume = 1;
    // } else if (data.sell_volume > data.wcn_balance) {
    //   data.sell_volume = data.wcn_balance;
    // }

    // if (data.buy_volume < 1) {
    //   data.buy_volume = 1;
    // } else if (data.buy_volume > (data.btc_balance / (data.sell_volume * 1.0025))) {
    //   data.buy_volume = data.btc_balance / (data.sell_volume * 1.0025);
    // }

    // get pending buy sell
    data.transaction_list = [];
    $("#pendingbuysell table tbody tr").each(function(index, item){
      var id = parseInt($(item).data('key'));
      var type = $(item).find("td").next().html();
      var price = $(item).find("td").next().next().html();
      var volume = $(item).find("td").next().next().next().html();
      if (id) {
        data.transaction_list.push({id: id, price: price, wnc: volume, type: type});
      }
    });

    return bitcoinView.data;
  },
  update: function() {
    $('#senseMain').replaceWith(bitcoinView.template.render(bitcoinView.data));
    return bitcoinView.data;
  },
  reset: function() {
    bitcoinView.data = {
    };
  },
  reloadPendingTransaction: function() {
    var html = (function() {/*
<tbody id="transaction-body">
  {{for transaction_list}}
    <tr>
      <tr data-key="{{:id}}">
        <td>{{>type}}</td>
        <td style="text-align:left;">{{>price}}</td>
        <td style="text-align:left;">{{>wnc}}</td>
        <td>
          <a data-id="{{:id}}" class="btn btn-xs btn-warning btnCancelOrder" title="Cancel" aria-label="Cancel Order"><i class="fa fa-remove"></i> Cancel</a>
        </td>
      </tr>
    </tr>
  {{/for}}
</tbody>
*/}).toString().match(/\n([\s\S]*)\n/)[1];
    var template = $.templates(html);
    var data = {'transaction_list' : []};
    $.get('/dashboard/ajaxpendingbuysell', function(response) {
      $(response).find("table tbody tr").each(function(index, item){
        var id = parseInt($(item).data('key'));
        var type = $(item).find("td").next().html();
        var price = $(item).find("td").next().next().html();
        var volume = $(item).find("td").next().next().next().html();
        if (id) {
          data.transaction_list.push({id: id, price: price, wnc: volume, type: type});
        }
      });
      $("#transaction-body").replaceWith(template.render(data));
    });
  },
  updateSellBuyTable: function(data) {
    var html = (function() {/*
<div id="orders-container">
  <div id="sell-orders" class="orders-container">
    <h4>Sell Orders</h4>
    <table class="table table-bordered table-condensed">
      <thead>
        <tr>
          <th>Price</th>
          <th>WNC</th>
        </tr>
      </thead>
      <tbody>
        {{for sell_order_list}}
          <tr>
            <tr data-key="{{:id}}">
              <td style="text-align:left;">{{>price}}</td>
              <td style="text-align:left;">{{>wnc}}</td>
            </tr>
          </tr>
        {{/for}}
      </tbody>
    </table>
  </div>

  <div id="buy-orders" class="orders-container">
    <h4>Buy Orders</h4>
    <table class="table table-bordered table-condensed">
      <thead>
        <tr>
          <th>Price</th>
          <th>WNC</th>
        </tr>
      </thead>
      <tbody>
        {{for buy_order_list}}
          <tr>
            <tr data-key="{{:id}}">
              <td style="text-align:left;">{{>price}}</td>
              <td style="text-align:left;">{{>wnc}}</td>
            </tr>
          </tr>
        {{/for}}
      </tbody>
    </table>
  </div>
</div>
*/}).toString().match(/\n([\s\S]*)\n/)[1];
    var template = $.templates(html);
    $('#orders-container').replaceWith(template.render(data));
  },
  updateSellBuyPrice: function() {
    var htmlSell = (function() {/*
{{for sell_price_volume_list}}
  <li id="li-suggest" data-value={{:price}} class="sell-price-list-item" data-volume={{:volume}}>{{>price}} --- {{>volume}}</li>
{{/for}}
*/}).toString().match(/\n([\s\S]*)\n/)[1];
    var htmlBuy = (function() {/*
{{for bid_price_volume_list}}
  <li id="li-suggest" data-value={{:price}} class="bid-price-list-item" data-volume={{:volume}}>{{>price}} --- {{>volume}}</li>
{{/for}}
*/}).toString().match(/\n([\s\S]*)\n/)[1];
    var data = {'sell_price_volume_list' : [], 'bid_price_volume_list' : [], 'sell_order_list' : [], 'buy_order_list' : []};
    var templateSell = $.templates(htmlSell);
    var templateBuy = $.templates(htmlBuy);
    var tempVolume, tempVolume2;
    var btcBalance;
    var wncBalance;

    // get old sell price and old sell volume
    var oldSellPrice = parseFloat($('#sell_price_volume_list li:first').data('value')).toFixed(8);
    var oldSellVolume = parseFloat($('#sell_price_volume_list li:first').data('volume')).toFixed(8);

    // get old sell price and old buy volume
    var oldBuyPrice = parseFloat($('#bid_price_volume_list li:first').data('value')).toFixed(8);
    var oldBuyVolume = parseFloat($('#bid_price_volume_list li:first').data('volume')).toFixed(8);

    $.get('/dashboard/ajaxbuybtc', function(response) {
      btcBalance = parseFloat($(response).find('#balance').val()).toFixed(8);
      $('#ip_btc_balance').val(btcBalance);
      $.get('/dashboard/ajaxmarketsell', function(response) {
        $(response).find("table tbody tr").each(function(index, item){
          var price = parseFloat($(item).find("td").html().replace(",", "")).toFixed(8);
          var volume = parseFloat($(item).find("td").next().html().replace(",", "")).toFixed(8);
          if(data.bid_price_volume_list.length < 5) {
            data.bid_price_volume_list.push({id: index + 1, price: price, price_label: price, volume: volume, volume_label: volume});
          }
          if(data.sell_order_list.length < 10) {
            data.sell_order_list.push({id: index + 1, price: price, wnc: volume});
          }
        });
        $('#bid_price_volume_list').children().remove();
        $('#bid_price_volume_list').append(templateBuy.render(data));

        if ($('#ip_bid_price').val() == '' || (!buyInputing && (data.bid_price_volume_list[0].price != oldBuyPrice || data.bid_price_volume_list[0].volume != oldBuyVolume))) {
          tempVolume2 = data.bid_price_volume_list[0].volume;
          if (tempVolume2 < 1) {
            tempVolume2 = 1;
          } else if (tempVolume2 > (btcBalance / (data.bid_price_volume_list[0].price * 1.0025))) {
            tempVolume2 = parseFloat(btcBalance / (data.bid_price_volume_list[0].price * 1.0025) - 0.5).toFixed(8);
          }
          $('#ip_bid_price').val(data.bid_price_volume_list[0].price);
          $('#ip_bid_price').attr('data-volume', data.bid_price_volume_list[0].volume);
          $('#ip_buy_volume').val(tempVolume2);
          check_buy_sell_price_and_notice();
        }

        bitcoinView.updateSellBuyTable(data);
      });
    });

    $.get('/dashboard/ajaxsellbtc', function(response) {
      wncBalance = parseFloat($(response).find('#balance2').val()).toFixed(8);
      $('#ip_wnc_balance').val(wncBalance);
      $.get('/dashboard/ajaxmarketbuy', function(response) {
        $(response).find("table tbody tr").each(function(index, item){
          var price = parseFloat($(item).find("td").html().replace(",", "")).toFixed(8);
          var volume = parseFloat($(item).find("td").next().html().replace(",", "")).toFixed(8);
          if(data.sell_price_volume_list.length < 5) {
            data.sell_price_volume_list.push({id: index + 1, price: price, price_label: price, volume: volume, volume_label: volume});
          }
          if(data.buy_order_list.length < 10) {
            data.buy_order_list.push({id: index + 1, price: price, wnc: volume});
          }
        });
        $('#sell_price_volume_list').children().remove();
        $('#sell_price_volume_list').append(templateSell.render(data));


        if ($('#ip_sell_price').val() == '' || (!sellInputing && (data.sell_price_volume_list[0].price != oldSellPrice || data.sell_price_volume_list[0].volume != oldSellVolume))) {
          tempVolume = data.sell_price_volume_list[0].volume;
          if (tempVolume < 1) {
            tempVolume = 1;
          } else if (tempVolume > wncBalance) {
            tempVolume = wncBalance;
          }
          $('#ip_sell_price').val(data.sell_price_volume_list[0].price);
          $('#ip_sell_price').attr('data-volume', data.sell_price_volume_list[0].volume);
          $('#ip_sell_volume').val(tempVolume);
          check_buy_sell_price_and_notice();
        }

        bitcoinView.updateSellBuyTable(data);
      });
    });
  }
};

var bitcoinView = new BitcoinMainView();

// var handleData = function() {
//   var balance_A, balance2_B, sellprice_y, theprice2_x, total_buy_a, total_sell_b, conditionVal;
//   conditionVal = parseFloat($("#conditionVal").val()) || 0.0;
//   balance_A = parseFloat($("#balance").val());
//   balance2_B = parseFloat($("#balance2").val());
//   sellprice_y = parseFloat($("#marketsell table tbody tr:first td:first").html().replace(",", ""));
//   theprice2_x = parseFloat($("#marketbuy table tbody tr:first td:first").html().replace(",", ""));
//   total_buy_a = parseFloat($("#marketbuy table tbody tr:first td:first").next().html().replace(",", ""));
//   total_sell_b = parseFloat($("#marketsell table tbody tr:first td:first").next().html().replace(",", ""));

//   if((theprice2_x - sellprice_y) > conditionVal) {
//     if (balance_A >= sellprice_y * total_sell_b * 1.0025) {
//       // Thực hiện lệnh Buy
//       var buyPrice = sellprice_y, totalBuy = total_sell_b;
//       $("#theprice2").val(buyPrice);
//       $("#total_buy").val(totalBuy);
//       $("#continuebuywnc").click();

//       // delay 3s
//       setTimeout(function() {
//         // Thực hiện lệnh Sell
//         var sellPrice = theprice2_x, totalSell = total_sell_b;
//         $("#sellprice").val(sellPrice);
//         $("#total_sell").val(totalSell);
//         $("#continuesellwnc").click();
//       }, 3000);
//     } else {
//       // Thực hiện lệnh Buy
//       var buyPrice = sellprice_y, totalBuy = parseFloat(balance_A / (sellprice_y * 1.0025));
//       $("#theprice2").val(buyPrice);
//       $("#total_buy").val(totalBuy);
//       $("#continuebuywnc").click();

//       // delay 3s
//       setTimeout(function() {
//         // Thực hiện lệnh Sell
//         var sellPrice = theprice2_x, totalSell = parseFloat(balance_A / (sellprice_y * 1.0025));
//         $("#sellprice").val(sellPrice);
//         $("#total_sell").val(totalSell);
//         $("#continuesellwnc").click();
//       }, 3000);
//     }
//   }
// };

// $(document).on('click', '#playBtn', function() {
//   $.cookie('play', true, { expires: 1 });
//   handleData();
// });

// $(document).on('click', '#stopBtn', function() {
//   $.removeCookie('play');
// });

$(document).on('change', '.combo-box', function() {
  var width = $(this).width();
  var chosen = $("option:selected", this).val();
  $(this).next(".ninja-input")
       .css({ "margin-left": -width - 3, width: width - 20 })
       .toggleClass("hidden", chosen != 'input');
});

// $(document).on('change', '#bid_price_list', function() {
//   var chosen = $("option:selected", this).data('id');
//   var sellVolume = parseFloat($('#ip_sell_volume').val());
//   var btc_balance = parseFloat($('#ip_btc_balance').val());
//   if (chosen != 0) {
//     var volume = parseFloat($("option:selected", this).data('volume'));

//     if (volume < 1) {
//       volume = 1;
//     } else if (volume > (btc_balance / (sellVolume * 1.0025))) {
//       volume = (btc_balance / (sellVolume * 1.0025)) || 0;
//     }
//     $('#ip_buy_volume').val(volume.toFixed(8));
//   }
// });

// $(document).on('change', '#sell_price_list', function() {
//   var chosen = $("option:selected", this).data('id');
//   var wcn_balance = parseFloat($('#ip_wnc_balance').val());
//   if (chosen != 0) {
//     var volume = parseFloat($("option:selected", this).data('volume'));

//     if (volume < 1) {
//       volume = 1;
//     } else if (volume > wcn_balance) {
//       volume = wcn_balance;
//     }
//     $('#ip_sell_volume').val(volume.toFixed(8));
//   }
// });

$(document).on('click', '#btnSell', function() {
  var csrfToken = $('#sellbtc form#formconfirm input[name="_frontendCSRF"]').val();
  // var price = ($('#ip_sell_price:visible').length == 0) ? $('#sell_price_list').find(":selected").val() : $('#ip_sell_price:visible').val();
  var price = $('#ip_sell_price').val();
  var volume = $('#ip_sell_volume').val();
  params = {
    '_frontendCSRF' : csrfToken,
    'BtcMarket[bm_value]' : price,
    'BtcMarket[bm_btc]' : volume
  };
  $.post('/dashboard/ajaxsellbtc', params, function(response){
    var confirmCsrf = $(response).find('#formconfirm input[name="_frontendCSRF"]').val();
    var confirmParams = {
      '_frontendCSRF' : confirmCsrf,
      'BtcMarket[bm_value]' : price,
      'BtcMarket[bm_btc]' : volume,
      'process' : '1'
    };
    $.post('/dashboard/ajaxsellbtc', confirmParams, function(response){
      console.log(response.status);
      bitcoinView.reloadPendingTransaction();
    });
  })
});

$(document).on('click', '#btnBuy', function() {
  var csrfToken = $('#buybtc form#formbuybtc input[name="_frontendCSRF"]').val();
  // var price = ($('#ip_bid_price:visible').length == 0) ? $('#bid_price_list').find(":selected").val() : $('#ip_bid_price:visible').val();
  var price = $('#ip_bid_price').val();
  var volume = $('#ip_buy_volume').val();
  params = {
    '_frontendCSRF' : csrfToken,
    'BtcMarket[bm_value]' : price,
    'BtcMarket[bm_btc]' : volume
  };
  $.post('/dashboard/ajaxbuybtc', params, function(response){
    var confirmCsrf = $(response).find('#formbuybtc input[name="_frontendCSRF"]').val();
    var confirmParams = {
      '_frontendCSRF' : confirmCsrf,
      'BtcMarket[bm_value]' : price,
      'BtcMarket[bm_btc]' : volume,
      'process' : '1'
    };
    $.post('/dashboard/ajaxbuybtc', confirmParams, function(response){
      console.log(response.status);
      bitcoinView.reloadPendingTransaction();
    });
  })
});

$(document).on('click', '.btnCancelOrder', function() {
  var id = $(this).data('id');
  var params = {'data-pjax' : '0'};
  $.post('/dashboard/ajaxcancelorder?id=' + id, params, function(response) {
    bitcoinView.reloadPendingTransaction();
  });
});

// focus set inputing true, loose focus set inputing false
$(document).on('focus', '#ip_bid_price', function() {
  buyInputing = true;
  $('#bid_price_volume_list').removeClass('hidden');
});

$(document).on('focus', '#ip_buy_volume', function() {
  buyInputing = true;
});

$(document).on('blur', '#ip_bid_price, #ip_buy_volume', function() {
  buyInputing = false;
});

$(document).on('focus', '#ip_sell_price', function() {
  sellInputing = true;
  $('#sell_price_volume_list').removeClass('hidden');
});

$(document).on('focus', '#ip_sell_volume', function() {
  sellInputing = true;
});

$(document).on('blur', '#ip_sell_price, #ip_sell_volume', function() {
  sellInputing = false;
});

// ======== focus set inputing true, loose focus set inputing false

$(document).on('click', '.sell-price-list-item', function() {
  var value = parseFloat($(this).data('value')).toFixed(8);
  var volume = parseFloat($(this).data('volume')).toFixed(8);
  var wncBalance = parseFloat($('#ip_wnc_balance').val()).toFixed(8);

  // set data-val for #ip_sell_price
  $('#ip_sell_price').attr('data-volume', volume);

  if (volume < 1) {
    volume = 1;
  } else if (volume > wncBalance) {
    volume = wncBalance;
  }

  $('#ip_sell_price').val(value);
  $('#ip_sell_volume').val(volume);
  check_buy_sell_price_and_notice();
  $('#sell_price_volume_list').addClass('hidden');
});

$(document).on('click', '.bid-price-list-item', function() {
  var value = parseFloat($(this).data('value')).toFixed(8);
  var volume = parseFloat($(this).data('volume')).toFixed(8);
  var btcBalance = parseFloat($('#ip_btc_balance').val()).toFixed(8);

  // set data-val for #ip_bid_price
  $('#ip_bid_price').attr('data-volume', volume);

  if (volume < 1) {
    volume = 1;
  } else if (volume > (btcBalance / (value * 1.0025))) {
    volume = parseFloat(btcBalance / (value * 1.0025) - 0.5).toFixed(8);
  }

  $('#ip_bid_price').val(value);
  $('#ip_buy_volume').val(volume);
  check_buy_sell_price_and_notice();
  $('#bid_price_volume_list').addClass('hidden');
});

$(document).on('click', 'body', function(evt){
  if (evt.target.id != 'li-suggest') {
    if (evt.target.id != 'ip_bid_price' && $('#bid_price_volume_list:visible').length > 0) {
      $('#bid_price_volume_list').addClass('hidden');
    }
    if (evt.target.id != 'ip_sell_price' && $('#sell_price_volume_list:visible').length > 0) {
      $('#sell_price_volume_list').addClass('hidden');
    }
  }
});

function check_buy_sell_price_and_notice() {
  var noticePoint = parseFloat($('#notice_point').val()).toFixed(8);
  var sellPrice = parseFloat($('#ip_sell_price').val()).toFixed(8);
  var bidPrice = parseFloat($('#ip_bid_price').val()).toFixed(8);
  var difference = parseFloat(sellPrice - bidPrice).toFixed(8);
  $('#difference_buy_sell').val(difference);

  if (noticePoint != '' && noticePoint > 0 && difference > noticePoint) {
    $('#difference_buy_sell').addClass('warning');
  } else {
    $('#difference_buy_sell').removeClass('warning');
  }
}

function check_buy_sell_price_and_notice_old_version() {
  var noticePoint = parseFloat($('#notice_point').val()).toFixed(8);
  if (noticePoint != '' & noticePoint > 0) {
    var sellPrice = parseFloat($('#ip_sell_price').val()).toFixed(8);
    var sellVolume = parseFloat($('#ip_sell_price').attr('data-volume')).toFixed(8);
    var bidPrice = parseFloat($('#ip_bid_price').val()).toFixed(8);
    var buyVolume = parseFloat($('#ip_bid_price').attr('data-volume')).toFixed(8);
    if (bidPrice - sellPrice > noticePoint) {
      // render msg
      var html = (function() {/*
<div class="err-msg">
  <div>Giá Buy: {{:bid_price}} --- {{:buy_volume}}</div>
  <div>Giá Sell: {{:sell_price}} --- {{:sell_volume}}</div>
  <div>X = {{:notice_point}}</div>
</div>
  */}).toString().match(/\n([\s\S]*)\n/)[1];
      var template = $.templates(html);
      var data = {'bid_price' : bidPrice, 'buy_volume' : buyVolume, 'sell_price' : sellPrice, 'sell_volume' : sellVolume, 'notice_point' : noticePoint};
      $("#buybtc-loading").parent().parent().parent().append(template.render(data));
    } else {
      remove_err_mes();
    }
  } else {
    remove_err_mes();
  }
}

function remove_err_mes() {
  $('.err-msg').remove();
}
