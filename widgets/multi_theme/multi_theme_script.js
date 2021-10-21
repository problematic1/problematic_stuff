ampInit();

function ampInit() {
  var ampContactBtn = document.getElementById("amp_widget_button");
  var ampWidgetContainer = document.getElementById("amp_widget_container");
  var ampWidgetControls = document.getElementById("amp_widget_controls");
  var ampWidgetChannels = document.querySelectorAll(
    ".channel_select input[type='radio']"
  );
  var cl = ampWidgetContainer.classList;

  if (cl.contains("amp_mobile")) {
    ampWidgetControls.addEventListener("click", ampToggleUpDown);
    ampWidgetChannels.forEach((element) => {
      element.addEventListener("click", ampAddSMSBody);
    });
  } else {
    ampWidgetControls.addEventListener("click", ampToggleUpDown);
    ampContactBtn.addEventListener("click", ampOpenContactForm);
    ampWidgetContainer
      .querySelectorAll(".channel_select label")
      .forEach((element) => {
        element.addEventListener("click", function () {
          ampEnableElement("amp_widget_inputs");
        });
      });
    ampWidgetContainer
      .querySelector("#amp_widget_inputs input[name='phone']")
      .addEventListener("input", function () {
        ampEnableElement("amp_widget_submit");
      });
  }
}

function ampEnableElement(el) {
  document.getElementById(el).classList.remove("amp_disabled");
}

function ampAddSMSBody() {
  var channel = this.value;
  var button = document.getElementById("amp_widget_sms_link");
  button.href =
    "sms:+1<%= account." +
    channel +
    ".phone_number %>?body=I want to talk to " +
    channel;
  ampEnableElement("amp_widget_sms_link");
}

/** 
-- 
I think everything below here is from original script 
-- 
**/

function ampOpenContactForm() {
  document
    .getElementById("amp_widget_container")
    .classList.add("amp_widget_expand");
  document.getElementById("amp_widget_controls").classList = "amp_downward";

  var ampContactForm = document.getElementById("amp_new_customer");
  if (!ampContactForm) return;

  var ampContactFormContainer = document.getElementById(
    "amp_widget_contact_form"
  );

  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((element) => {
      var jsonData = JSON.parse(element.innerText);
      if (
        jsonData.makesOffer &&
        jsonData.makesOffer.itemOffered &&
        jsonData.makesOffer.itemOffered.name
      ) {
        var ampInterestedProductTitle = document.createElement("input");
        var ampInterestedProductPrice = document.createElement("input");
        var ampInterestedProductUrl = document.createElement("input");
        var ampInterestedProductImage = document.createElement("input");
        var ampInterestedProductIdentifier = document.createElement("input");

        ampInterestedProductTitle.type = "hidden";
        ampInterestedProductTitle.name = "poi[title]";
        ampInterestedProductTitle.value = jsonData.makesOffer.itemOffered.name;

        ampInterestedProductPrice.type = "hidden";
        ampInterestedProductPrice.name = "poi[price]";
        ampInterestedProductPrice.value =
          jsonData.makesOffer.priceSpecification.price;

        ampInterestedProductUrl.type = "hidden";
        ampInterestedProductUrl.name = "poi[url]";
        ampInterestedProductUrl.value = jsonData.makesOffer.itemOffered.url;

        ampInterestedProductImage.type = "hidden";
        ampInterestedProductImage.name = "poi[image]";
        ampInterestedProductImage.value = jsonData.makesOffer.itemOffered.image;

        ampInterestedProductIdentifier.type = "hidden";
        ampInterestedProductIdentifier.name = "poi[identifier]";
        ampInterestedProductIdentifier.value =
          jsonData.makesOffer.itemOffered.vehicleIdentificationNumber;

        ampContactForm.prepend(ampInterestedProductTitle);
        ampContactForm.prepend(ampInterestedProductPrice);
        ampContactForm.prepend(ampInterestedProductUrl);
        ampContactForm.prepend(ampInterestedProductImage);
        ampContactForm.prepend(ampInterestedProductIdentifier);
      }
    });

  if (ampContactForm.addEventListener) {
    ampContactForm.addEventListener("submit", ampSubmitContactForm, false);
  } else if (ampContactForm.attachEvent) {
    ampContactForm.attachEvent("onsubmit", ampSubmitContactForm);
  }
  ampContactFormContainer.querySelector("#amp_customer_first_name").focus();
}

function ampCloseContactForm() {
  document
    .getElementById("amp_widget_container")
    .classList.remove("amp_widget_expand");
  document.getElementById("amp_widget_controls").classList = "amp_upward";
}

function ampToggleUpDown() {
  var ampWidgetControlsDirection = document.getElementById(
    "amp_widget_controls"
  ).classList;

  if (ampWidgetControlsDirection == "amp_upward") {
    ampOpenContactForm();
    ampWidgetControlsDirection = "amp_downward";
  } else {
    ampCloseContactForm();
    ampWidgetControlsDirection = "amp_upward";
  }
}

function ampToggleLeftRight() {
  var ampWidgetControlsDirection = document.getElementById(
    "amp_widget_controls"
  ).classList;
  if (ampWidgetControlsDirection == "amp_forward") {
    ampWidgetControlsDirection.remove("amp_forward");
    ampWidgetControlsDirection.add("amp_backward");
    document
      .getElementById("amp_widget_container")
      .classList.add("amp_condensed");
  } else {
    ampWidgetControlsDirection.remove("amp_backward");
    ampWidgetControlsDirection.add("amp_forward");
    document
      .getElementById("amp_widget_container")
      .classList.remove("amp_condensed");
  }
}

function ampSubmitContactForm(event) {
  event.preventDefault();
  var valid = true;

  var ampContactForm = event.target;
  var submitBtn = ampContactForm.querySelector('input[type="submit"]');
  var phone = ampContactForm.querySelector('input[name="phone"]');

  if (phone.value.replace(/\D/g, "").length != 10) {
    valid = false;
    ampMarkInvalid(phone);
  }

  if (valid) {
    submitBtn.setAttribute("disabled", "disabled");
    submitBtn.value = "Sending...";
    var url = ampContactForm.action,
      xhr = new XMLHttpRequest(),
      ampContactData = new FormData(ampContactForm);

    xhr.open("POST", url);
    xhr.onload = ampUpdateFormStatus.bind(xhr);
    xhr.send(ampContactData);
  }
}

function ampUpdateFormStatus() {
  var ampContactFormContainer = document.getElementById(
    "amp_widget_contact_form"
  );
  ampContactFormContainer.innerHTML = "Thank you for contacting us!";
  setTimeout(function () {
    document
      .getElementById("amp_widget_container")
      .classList.remove("amp_widget_expand");
  }, 3000);
  var ampNow = new Date();
  var ampExpires = new Date();
  ampExpires.setTime(ampExpires.getTime() + 300000);
  var ampCookie =
    "inlineText_contacted=" +
    ampNow.toUTCString() +
    ";expires=" +
    ampExpires.toUTCString() +
    ";path=/";
  document.cookie = ampCookie;
}

function ampMarkInvalid(el) {
  el.classList.add("amp_warning");
}

function formatPhone(event) {
  el = event.target;
  el.value = el.value
    .match(/\d*/g)
    .join("")
    .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
    .slice(1)
    .join("")
    .replace(phoneRegex, "($1) $2-$3");
}

function isMobileDevice() {
  var check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
