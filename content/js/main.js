$(document).ready(function () {
  /* Trigger carousel */
  $(".carousel").carousel();

  /* Shows the Cookie banner */
  function showCookieBanner() {
    let cookieBanner = document.getElementsByClassName("cookie-banner")[0];
    cookieBanner.style.display = "block";
  }

  /* Hides the Cookie banner and saves the value to localstorage */
  function hideCookieBanner() {
    localStorage.setItem("isCookieAccepted", "yes");
    let cookieBanner = document.getElementsByClassName("cookie-banner")[0];
    cookieBanner.style.display = "none";
  }

  /* Checks the localstorage and shows Cookie banner based on it. */
  function initializeCookieBanner() {
    let isCookieAccepted = localStorage.getItem("isCookieAccepted");
    if (isCookieAccepted === null) {
      localStorage.clear();
      localStorage.setItem("isCookieAccepted", "no");
      showCookieBanner();
    }
    if (isCookieAccepted === "no") {
      showCookieBanner();
    }
  }
  // Assigning values to window object
  window.onload = initializeCookieBanner();
  window.hideCookieBanner = hideCookieBanner;

  $(".book-table-date").datepicker({
    format: "dd/mm/yyyy",
    startDate: "+1d",
    autoclose: true,
  });
});

// CONTACT FORM

$(document).ready(function () {
  var RECIPIENT_EMAILS = ["info@cnduck.ie"];
  var EMAIL_SUBJECT = "CN Duck Book Table!";
  var RECAPTCHA_SITE_KEY = "6LdZUXUeAAAAAApf1gr5hWZFKvPZWs99JWBjIo-N";
  var BOOK_TABLE_ENDPOINT =
    "https://abite6ti3a.execute-api.eu-west-1.amazonaws.com/Prod/send";
  var SENDER_EMAIL = "noreply@mycloudpa.com";

  $("#bookTableFrom").submit(function () {
    $("#sendButton").prop("disabled", true);
    const bookTableForm = getBookTableFormData();

    grecaptcha.ready(function () {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
        .then(function (token) {
          const request = JSON.stringify(
            createSendEmailRequest(bookTableForm, token)
          );
          sendBookTableEmail(request);
        });
    });

    return false;
  });

  function getBookTableFormData() {
    const bookTableForm = {};
    bookTableForm["name"] = $("#name").val();
    bookTableForm["telNumber"] = $("#telNumber").val();
    bookTableForm["email"] = $("#email").val();
    bookTableForm["date"] = $("#date").val();
    bookTableForm["hours"] = $("#hours")
      .children("option")
      .filter(":selected")
      .text();
    bookTableForm["minutes"] = $("#minutes")
      .children("option")
      .filter(":selected")
      .text();
    bookTableForm["numOfGuests"] = $("#numOfGuests").val();
    bookTableForm["otherEnquiries"] = $("#otherEnquiries").val();
    return bookTableForm;
  }

  function sendBookTableEmail(request) {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: BOOK_TABLE_ENDPOINT,
      data: request,
      dataType: "json",
      cache: false,
      timeout: 600000,
      statusCode: {
        500: function (e) {
          handleFailedResponse(e);
        },
        400: function (e) {
          handleFailedResponse(e);
        },
        204: function (data) {
          $("#successfulMessage").removeClass("d-none");
          $("#bookTableFrom").addClass("d-none");
          document.getElementById("successfulMessage").scrollIntoView();
          window.location.href = "thank-you.html";
        },
      },
    });
  }

  function handleFailedResponse(ex) {
    console.log("ERROR : ", ex);
    $("#failedMessage").removeClass("d-none");
    document.getElementById("failedMessage").scrollIntoView();
  }

  function createSendEmailRequest(bookTableForm, token) {
    return {
      toEmails: RECIPIENT_EMAILS,
      subject: EMAIL_SUBJECT,
      message: createMesssageBoday(bookTableForm),
      token: token,
      senderEmail: SENDER_EMAIL,
    };
  }

  function createMesssageBoday(form) {
    return (
      "<p>Name: " +
      form["name"] +
      "</p>" +
      "<p>Phone Number: " +
      form["telNumber"] +
      "</p>" +
      "<p>Email: " +
      form["email"] +
      "</p>" +
      "<p>Date: " +
      form["date"] +
      "<p>Time: " +
      form["hours"] +
      ":" +
      form["minutes"] +
      "</p>" +
      "<p>Number Of Guests: " +
      +form["numOfGuests"] +
      "</p>" +
      "<p>Other Enquiries: " +
      form["otherEnquiries"] +
      "</p>"
    );
  }
});
