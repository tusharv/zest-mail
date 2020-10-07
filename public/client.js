// client-side js
// run by the browser each time your view template is loaded

// define variables that reference elements on our page
const mailForm = document.forms[0];
const mailMessage = document.querySelector('textarea[name="message"]');
const mailPreview = document.querySelector('#preview');


mailMessage.onkeyup = function(event){
  mailPreview.contentDocument.write(mailMessage.value);
  mailPreview.contentDocument.close();
}

// listen for the form to be submitted and add a new dream when it is
mailForm.onsubmit = function(event) {
  
};
