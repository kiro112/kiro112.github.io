/* 

   B9lab Academy Javascript                          v1.1
   ******************************************************
   (c) B9lab ltd - Ibo Sy                   www.b9lab.com
   

   Content:
    * Settings / Data
    * Methods
    * Data Handler
    * Function Helpers
    * UI/UX Helpers
    * Checkout Class
    * Settings

   Notes:
    * 1.1 - added fixes for IE
*/

function Academy(){};

/*     Settings/Data     */

// Tracking
Academy.prototype.tracking = {
  t_timer: null,
  is_initialized: false,
  user_identified: false,
  user: {
    id: null,
    fullname: null,
    username: null,
    email: null,
    country: null,
    intercom_hash: null
  }
};

// Config settings
Academy.prototype.settings = {
  enable_debug_log: true
};

// Course info
Academy.prototype.course = {
  number: null,
  start_date: null,
  end_date: null,
  effort: null,
  price: null,
  button_href: null,
  button_text: null,
  button_class_extra: null,
  button_data: null,
  info_text: null,
  info_class: null
}


/*     Methods     */

Academy.prototype.init = function()
{
  this.debugLog("init Academy JS");
  this.loadTracking();

  // After-load changes, injects, etc.
  this.updateUI();

  // Trigger Checkout init
  this.Checkout.init();
};

Academy.prototype.debugLog = function(str)
{
  if(this.settings.enable_debug_log) console.log("[ACADEMY] " + str.toString());
}

// Event handling
Academy.prototype.recordEvent = function()
{
  //analytics.track("testevent", {type: "testtype", test1: "testval2"});
};

// Tracking management
// document ready -> loadTracking -> loadTrackingUpdateStatus{polls} -> analytics.ready -> loadTrackingFinished
Academy.prototype.loadTracking = function()
{
  this.debugLog("load tracking");
  this.loadTrackingUpdateStatus();
};

Academy.prototype.loadTrackingUpdateStatus = function()
{
  // Out of scope! Don't use this
  if(!analytics || !analytics.ready) {
    Academy.tracking.t_timer = setTimeout(Academy.loadTrackingUpdateStatus, 200);
  } else {
    clearTimeout(Academy.tracking.t_timer);
    analytics.ready(function(){
      Academy.loadTrackingFinished();
    });
  }
};

Academy.prototype.loadTrackingFinished = function()
{
  this.debugLog("load tracking finished");
  this.tracking.is_initialized = true;
  this.trackUser();
  this.loadFrontChat();
};

Academy.prototype.trackUser = function()
{
  // call page, hide intercom messenger
  analytics.page({},{Intercom:{hideDefaultLauncher: true}});

  if(this.tracking.user_identified)
  {
    this.debugLog("Track identified user");
    this.debugLog("user hash: S[" + this.tracking.user.intercom_hash + "]");

    /* to be moved to front chat
    if (window.location.href.indexOf("shoppingcart") > -1) {
      hide_intercom_messenger = true;
    }
    */

    u = this.tracking.user;

    analytics.identify(u.id, {
      name: u.fullname,
      email: u.email,
      username: u.username
    },
    {
      Intercom: {
        hideDefaultLauncher: true,
        user_hash: u.intercom_hash
      }
    });
  } else {
    this.debugLog("Track unknown user");
  }
};

Academy.prototype.loadFrontChat = function()
{
  this.debugLog("load front chat");
  if(!this.tracking.user_identified || (window.location.href.indexOf("shoppingcart") > -1)) {
    if(typeof(window.FCSP) !== "undefined" && window.FCSP != "") {
      $.getScript("https://chat-assets.frontapp.com/v1/chat.bundle.js");
    } else {
      this.debugLog("ERROR: Could not load Front Chat, key not set");
    }
  }
}

/*     Data Handler     */

// Tracking - setters
// This will be called from the footer, where the userdata is injected into the html when rendering the page (server).
Academy.prototype.setUserData = function(userdata)
{
  //this.debugLog("SetUserData");
  // Object.assign(Academy.tracking.user, userdata); 
  // Wait for IE & Mobile, instead:
  for (var prop in userdata) {
    this.tracking.user[prop] = userdata[prop];
  }

  this.tracking.user_identified = true;
  this.debugLog(userdata);
};

// Course - setters
Academy.prototype.setCourseData = function(coursedata)
{
  this.debugLog("SetCourseData");
  for (var prop in coursedata) {
    this.course[prop] = coursedata[prop];
  }
};

/*     Function Helpers     */

Academy.prototype.navGetSlackLink = function(courseId)
{
  // This function tries to get the course id (in a form of "eth-11") to link to the course slack channel.
  // https://b9labacademy.slack.com/messages/academy-eth-11
  base_url = "https://b9labacademy.slack.com/";
  channel_name = null;
  is_consensys = false;

  re = /ETH-[0-9]{1,3}/;
  result = re.exec(courseId);

  if(!result || result.length ==0)
  {
    re = /CTO-[0-9]{1,3}/;
    result = re.exec(courseId);
  }
  if(!result || result.length ==0)
  {
    re = /HLF-[0-9]{1,3}/;
    result = re.exec(courseId);
  }
  if(!result || result.length ==0)
  {
    re = /ETH-QA-[0-9]{1,3}/;
    result = re.exec(courseId);
  }
  if(!result || result.length ==0)
  {
    re = /QSE-[0-9]{1,3}/;
    result = re.exec(courseId);
  }
  if(!result || result.length ==0)
  {
    re = /BFP-[0-9]{1,3}/;
    result = re.exec(courseId);
  }
  if(!result || result.length ==0)
  {
    re = /BFP-BAR-[0-9]{1,3}/;
    result = re.exec(courseId);
  }
  if(!result || result.length ==0)
  {
    re = /CNSNSS-DEV-[0-9]{1,3}(?!(-FAST))/;
    result = re.exec(courseId);
    if(result && result.length>0)
    {
      base_url = "https://consensys-academy.slack.com/";
      is_consensys = true;
      channel_name = "academy-" + result[0].toLowerCase();
    }
  }
  if(!result || result.length ==0)
  {
    re = /CNSNSS-DEV-[0-9]{1,3}(-FAST){1}/;
    result = re.exec(courseId);
    if(result && result.length>0)
    {
      base_url = "https://consensys-academy.slack.com/";
      is_consensys = true;
      channel_name = result[0].toLowerCase();
    }
  }
  // This needs to be updated for our workshops

  if(result && result.length >0)
  {
    if(is_consensys)
    {
      //channel_name = result[0].toLowerCase(); // use channel_name
    } else {
      channel_name = "academy-" + result[0].toLowerCase();
    }
  }

  if(channel_name)
  {
    return base_url + "messages/" + channel_name
  } else {
    return base_url;
  }
};

Academy.prototype.setBackgroundColorOfElementFromImage = function(element, image)
{
  var canvas= document.createElement('canvas');
  var myImg = document.createElement('img');
  $(image).each(function(i,imgObj){
    myImg.src = imgObj.src;
    $(myImg).one('load',function(){
      var context = canvas.getContext('2d');
      context.drawImage(myImg, 0, 0);
      data = context.getImageData(1, 1, 1, 1).data;
      var r = data[0];
      var g = data[1];
      var b = data[2];
      var a = data[3];
      $(element).css('background-color','rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
    });
  })
};

/*     UI/UX Helpers     */
Academy.prototype.updateUI = function()
{
  this.updateCourseMenu();
  this.updateCourseSidebar();
};

Academy.prototype.updateCourseMenu = function()
{
  if($(".course-tabs").length > 0)
  {
    courseid = window.location.href; // quick one, TODO: improve by injecting server-side
    link = "https://b9labacademy.slack.com/"

    // extra: disable discussion link on the 101 Courses (ETH 101 and HLF 101)
    excludedCourses = ["B9lab/X16-0/2016", "course-v1:B9lab+HLF-101+2017-11"];
    for (exCourse in excludedCourses) {
      if (courseid.indexOf(excludedCourses[exCourse]) != -1) {
        $(".course-tabs").find("a:contains('Discussion')").hide();
        break;
      }
    }

    link = this.navGetSlackLink(courseid);
    
    // Add anyway in case a course slips through or user with screen reader
    $(".course-tabs").find("a:contains('Discussion')").prop("href", link).prop("target", "_blank");
  }
};

Academy.prototype.updateCourseSidebar = function()
{
  sidebar = $("#info-sidebar");
  info_lbl = sidebar.find(".course-data-info");

  sidebar.find(".course-data-number").html(this.course.number);
  sidebar.find(".course-data-start").html(this.course.start_date);
  sidebar.find(".course-data-end").html(this.course.end_date);
  sidebar.find(".course-data-effort").html(this.course.effort);
  sidebar.find(".course-data-price").html(this.course.price);

  action_btn = sidebar.find(".course-data-cta-btn");
  if (this.course.button_class_extra) action_btn.addClass(this.course.button_class_extra);
  if (this.course.button_text) action_btn.html(this.course.button_text);
  if (this.course.button_href) action_btn.prop('href', this.course.button_href);
  if (this.course.button_data) action_btn.data('course', this.course.button_data);

  if(this.course.info_text) info_lbl.html(this.course.info_text);
  if(this.course.info_class) info_lbl.addClass(this.course.info_class);
};

/*     Checkout     */

// Checkout (Shoppingcart) settings
Academy.prototype.Checkout = {
  settings: {
    STRIPE_API_PK: null
  },
  customer: {
    country: null,
    vat_number: null,
    sale_type: null, // B2B, B2C
  },
  order: {
    // all amounts in cents!
    order_type: null, // standard, eservice, ebook
    net_total: null,
    vat_amount: null,
    order_total: null,
    vat_text: null,
    currency: null,
    order_items: Array() // [{item_count, item_description, item_price, line_total}]
  },
  payment: {
    type: null
  },
  handlers: {
    externalUISetData: null,
    externalUISetError: null,
    externalUIClearError: null
  },
  error: null,
  
  init: function() {
    Academy.debugLog("Init Academy Checkout");

    this.loadInitialData();
  },

  loadInitialData: function() {
    // try to get userdata
    Academy.debugLog("KILLME: loadInitialData");
    userdata = {};
    userdata.country = Academy.tracking.user.country;
    userdata.sale_type = "B2C";

    this.updateUserData(userdata);
  },

  // deprecated
  uiChangeHandler: function(e) {
    // get selected saletype and vat number
    //u_sale_type = $("#checkout-saletype").val();
    //u_vat_num = $("#vat-input-box").val();

    this.updateUserData({sale_type: u_sale_type, vat_number: u_vat_num});
  },

  externalUpdateData: function(data) {
    // data = { userdata: {..}, order: {..} }
    Academy.debugLog("externalUpdateUserData:");
    console.log(data);

    if(data.userdata) Academy.Checkout.updateUserData(data.userdata);
    if(data.order) Academy.Checkout.updateCartData(data.order);

    Academy.Checkout.calculateTax();
  },

  updateUserData: function(userdata) {
    // expects userdata object

    for (var prop in userdata) {
      Academy.Checkout.customer[prop] = userdata[prop];
    }
  },

  updateCartData: function(order) {
    // expects order object

    for (var prop in order) {
      Academy.Checkout.order[prop] = order[prop];
    }
  },

  calculateTax: function() {
    // input data:
    //  * Customer data (country, [tax_number, order_type])
    //  * Order data (order_type, net_total)
    // calculate applicable vat
    // output:
    //  * Order data (vat_amount, order_total, vat_text, currency, order items)

    endpoint = "/shoppingcart/calculate_tax/";
    customer_country = this.customer.country;
    customer_tax_number = this.customer.vat_number;
    net_total = this.order.net_total || 0;
    order_type = this.order.order_type;
    order_currency = this.order.order_currency;

    customer_country = this.customer.country;
    sale_type = this.customer.sale_type;
    tax_num = this.customer.vat_number;

    r_data = { customer_country: customer_country, customer_sale_type: sale_type, order_type: order_type, order_net_total: net_total, customer_tax_number: customer_tax_number, order_currency: order_currency};

    request = {
      method: 'POST',
      url: endpoint,
      data: r_data,
      dataType: "json",
      complete: this.calculateTaxResult
    }

    Academy.error = null;
    Academy.debugLog("Request tax calculation");
    AcademyShoppingCart.ui.btn_payment.addClass("disabled"); // TODO: Isy remove direct access
    $.ajax(request);

  },

  calculateTaxResult: function(jqXHR, textStatus) {
    // Out of scope! Don't use this
    // Callback from calculateTax, should also trigger ui update.
    Academy.debugLog("Tax calculation response received, network status: " + textStatus);

    if (textStatus == "success") {
      // ajax request ok, check result
      console.log(jqXHR);

      r_json = jqXHR.responseJSON;

      // Do some checks - jump out on fail
      if (!r_json['taxcalculation'] || !r_json['taxcalculation']['status']) 
        return Academy.Checkout.updateTaxError("Invalid API response - please try again later.");

      if (r_json['taxcalculation']['status'] != 'success') {
        err_msg = "Tax calculation " + r_json['taxcalculation']['status'];
        //if (r_json['taxcalculation']['errortype']) err_msg += "\nType: " + r_json['taxcalculation']['errortype'];
        //if (r_json['taxcalculation']['error']) err_msg += "\nDetails: " + r_json['taxcalculation']['error'].toString();
        internal_error = r_json['taxcalculation']['error']
        if (internal_error['global'] && internal_error['global'][0] && internal_error['global'][0]['details'] && internal_error['global'][0]['details'] == "Unable to compute customer localization evidence") {
          err_msg += " - Invalid tax number";
        } else {
          err_msg += " - Invalid tax number?";
        }
        return Academy.Checkout.updateTaxError(err_msg);
      }

      if (typeof(r_json['taxcalculation']['validations']['validation_result']) === "undefined")
        return Academy.Checkout.updateTaxError("Error: Validation data error");

      if (r_json['taxcalculation']['validations']['validation_result'] != true) {
        err_msg = "Validation error: ";
        validations = r_json['taxcalculation']['validations'];
        if (validations['tax_number'] != true) err_msg += "Invalid tax number";
        //if (validations['sale_mode_match'] != true) err_msg += "\nSale mode error! Please reload or contact support.";

        return Academy.Checkout.updateTaxError(err_msg);
      }

      // All Ok, process data
      tax_result = r_json['taxcalculation']['data']
      Academy.Checkout.order.vat_amount = tax_result.tax_amount;
      Academy.Checkout.order.order_total = tax_result.order_total;
      Academy.Checkout.order.vat_text = tax_result.tax_rate + "% " + tax_result.tax_type;
      Academy.Checkout.order.currency = tax_result.order_currency;

      Academy.debugLog("Tax calculation result validation passed", "debug");
      Academy.Checkout.removeTaxError();
      Academy.Checkout.handlers.externalUIClearError();
      Academy.Checkout.updatePriceDisplay();

    } else if (textStatus == "error") {
      return Academy.Checkout.updateTaxError("Network error, please try again.");
    } else if (textStatus == "timeout") {
      return Academy.Checkout.updateTaxError("Network timeout, please try again.");
    }
  },

  updateTaxError: function(error) {
    err_lvl="error";
    Academy.debugLog("Tax Error (" + err_lvl + ": " + error + ")");

    this.error = error;
    if (this.handlers.externalUISetError) {
      this.handlers.externalUISetError(error);
    }
    // indicate error
  },

  removeTaxError: function() {
    console.log("remove tax error");
    this.error = null;
    if (this.handlers.externalUISetError) {
      this.handlers.externalUISetError(null);
    }
  },

  updatePriceDisplay: function() {
    // update ui with updated price information
    // deprecated: call AcademyShoppingCart.setData here
    // instead: call handler (which is set to AcademyShoppingCart's setData)
    data = {order: this.order, error: this.error};

    if(this.handlers.externalUISetData) {
      this.handlers.externalUISetData(data);
    } else {
      debugLog("Error: Can't update price display, no ui handler set");
    }

    // indicate success / failure
  },

  preparePayment: function() {
    // setup payment, check payment sources
  },

  initiatePayment: function() {
    // call payment
  },

  getDataUpdateFunc: function() {
    return this.externalUpdateData;
  }

};


var Academy = new Academy();

// END Academy JS
