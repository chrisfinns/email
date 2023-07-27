document.addEventListener('DOMContentLoaded', function() {



  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector
  
  document.querySelector('#compose-form').onsubmit = send_email;


  
  // By default, load the inbox
  load_mailbox('inbox');

  //document.getElementsByClassName('email-item').addEventListener('click', view_email());

});

function clear_email() {
    var element =  document.querySelector('#display-email');
  if (typeof(element) != 'undefined' && element != null)
  {
    while (element.firstChild) {
      element.firstChild.remove()
    }
  }
}

function clear_emailitems() {
  var element =  document.querySelectorAll('.email-items');
if (typeof(element) != 'undefined' && element != null)
{
  
  // console.log('There is a email-utem')
  element.remove();
  while (element.firstChild) {
    element.firstChild.remove()
  }
}
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  
  clear_email();


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';




}



function view_email() {
  document.querySelectorAll('.email-item').forEach(item => {
    item.addEventListener('click', event => {
      console.log(`${item.id}`)

      fetch(`/emails/${item.id}`)
      .then(response => response.json())
      .then(email => {
    // Print email
      
    document.querySelector('#emails-view').style.display = 'none';

    // console.log(email);
      let emailContainer = document.createElement('div');
    
       // Check to see if there is a email container already
      var element =  document.querySelector('.email-content');

      
      if (typeof(element) != 'undefined' && element != null)
      {
        // console.log('Exists')
        while (element.firstChild) {
          //element.remove()
          element.firstChild.remove()
        }

        emailContainer.innerHTML = `
        <div class='email-content'>
        <p><b>From:</b> ${email.sender} </p>
        <p><b>To:</b> ${email.recipients} </p>
        <p><b>Subject:</b> ${email.subject} </p>
        <p><b>Timestamp:</b> ${email.timestamp} </p>
        <hr></hr>
        <p>${email.body} </p>
        <div>
        `
        document.getElementById('display-email').appendChild(emailContainer);

      } else {

        emailContainer.innerHTML = `
        <div class='email-content'>
        <p><b>From:</b> ${email.sender} </p>
        <p><b>To:</b> ${email.recipients} </p>
        <p><b>Subject:</b> ${email.subject} </p>
        <p><b>Timestamp:</b> ${email.timestamp} </p>
        <button class="btn btn-sm btn-outline-primary" id="reply-button">Reply</button>
        <hr>
        <p>${email.body} </p>
        <div>
        `
        document.getElementById('display-email').appendChild(emailContainer);

        fetch(`/emails/${item.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
          })
      
        
        document.querySelector('#reply-button').addEventListener('click', () => {

          // console.log("Reply Clicked")
          compose_email();
          document.querySelector('#compose-recipients').value = email.sender;
          
          let subject = email.subject;

          if (subject.includes('Re:')) {
            // console.log('Included');
            document.querySelector('#compose-subject').value = email.subject;

          } else {
            document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
          }
          document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: "${email.body}"`;



        });
        

        const archiveButton = document.createElement('button')
        archiveButton.innerHTML = "Archive Email"
        archiveButton.className = "btn btn-sm btn-outline-primary"
        document.getElementById('display-email').appendChild(archiveButton);


  
        archiveButton.onclick = function() {

         // console.log("Archive Button Clicked")
         fetch(`emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        })
        .then(() => load_mailbox('inbox'))

       // load_mailbox('inbox');
        

        }
      if (document.querySelector('h3').textContent === 'Archive') {
        //console.log('This is archive view');
        archiveButton.innerHTML = "Unarchive Email"
        archiveButton.onclick = function() {
         console.log("Archive Button Clicked")
         fetch(`emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: false
          })
        })
        .then(() => load_mailbox('inbox'))


      }

      }

      }

    // Delete content

    // Recreate when clicked
      

      }); 

    });
  });
}

function send_email() {
    
  const recipient = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const body = document.querySelector('#compose-body').value


  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipient,
      subject: subject,
      body: body
    })
  })
.then(response => response.json())
.then(result => {
    //console.log(result)
})
  load_mailbox('sent');
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  


  clear_email()


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show each INBOX email
  if ( mailbox === 'inbox') {
    
    
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      //console.log(emails)
      for (let x in emails) {

        
        let div = document.createElement('div');
        div.className = "email-item";
        let emailID = emails[x].id;
        div.id = `${emailID}`;
        document.getElementById('emails-view').appendChild(div);

        let sender = document.createElement('div');
        document.getElementById(emailID).appendChild(sender);
        sender.className = "email-sender";
        sender.innerHTML = emails[x].sender;

        let subject = document.createElement('div');
        document.getElementById(emailID).appendChild(subject);
        subject.className = "email-subject";
        subject.innerHTML = emails[x].subject;

        let timestamp = document.createElement('div');
        document.getElementById(emailID).appendChild(timestamp);
        timestamp.className = "email-timestamp";
        timestamp.innerHTML = emails[x].timestamp;
        
        // console.log(emails[x].read);

        if (emails[x].read) {
          // console.log('The email has been read')
          div.className += " read";
        }
        //console.log(div.className);
      }
      
      view_email();

    });

  }
  
  // SHOW each SENT email
  if ( mailbox === 'sent') {
    
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {

      for (let x in emails) {

        let div = document.createElement('div');
        div.className = "email-item";
        let emailID = emails[x].id;
        div.id = `${emailID}`;
        document.getElementById('emails-view').appendChild(div);

        let sender = document.createElement('div');
        document.getElementById(emailID).appendChild(sender);
        sender.className = "email-sender";
        sender.innerHTML = emails[x].sender;

        let subject = document.createElement('div');
        document.getElementById(emailID).appendChild(subject);
        subject.className = "email-subject";
        subject.innerHTML = emails[x].subject;

        let timestamp = document.createElement('div');
        document.getElementById(emailID).appendChild(timestamp);
        timestamp.className = "email-timestamp";
        timestamp.innerHTML = emails[x].timestamp;
        
       // console.log(emails[x]);
        
      }
      view_email();


    });


  }
  
  // Show archived emails

  if ( mailbox === 'archive') {
    
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {

      for (let x in emails) {

        let div = document.createElement('div');
        div.className = "email-item";
        let emailID = emails[x].id;
        div.id = `${emailID}`;
        document.getElementById('emails-view').appendChild(div);

        let sender = document.createElement('div');
        document.getElementById(emailID).appendChild(sender);
        sender.className = "email-sender";
        sender.innerHTML = emails[x].sender;

        let subject = document.createElement('div');
        document.getElementById(emailID).appendChild(subject);
        subject.className = "email-subject";
        subject.innerHTML = emails[x].subject;

        let timestamp = document.createElement('div');
        document.getElementById(emailID).appendChild(timestamp);
        timestamp.className = "email-timestamp";
        timestamp.innerHTML = emails[x].timestamp;
        
       // console.log(emails[x]);
        
      }
      view_email();


    });


  }


}

