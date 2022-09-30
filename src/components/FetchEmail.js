import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Base64 } from "js-base64";


const FetchEmail = () => {
  
  const [emails, setEmails] = useState({
    data: { messages: [{ id: "", threadId: "" }] },
  });

  const [message, setMessage] = useState({
    data: {
      snippet: "",
      payload: {
        headers: [{ name: "", value: "" }],
        body: { data: "" },
        parts: [{ body: { data: "" }, parts: [{ body: { data: "" } }] }],
      },
    },
  });

  useEffect(() => {
    getMessageID(); 
  }, []);

  const refresh = () => {
    getMessageID();
   setInterval(() => {
      getMessageID()
      }, 10000);
  };
 

  const getMessageID = async () => {
    try {
      const msgId = await axios.get(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages",
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );
      setEmails(msgId);

      
    } catch (err) {
      return err;
    }
  };
 
  const getEmailMessage = async (messageId) => {
    try {
      const msg = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );
      
      setMessage(msg);
      
    } catch (err) {
      return err;
    }
  };
 
  return (
    <>
      <h2>EMAILS</h2>
      <button onClick={() => refresh()}>Refresh</button>

      <div className="container">
        
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Message ID</th>
                <th>Thread ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {emails ? (
                emails.data.messages.map((messages) => (
                  <tr key={messages.id}>
                    <td>{messages.id}</td>
                    <td>{messages.threadId}</td>
                    <td>
                      <button onClick={() => getEmailMessage(messages.id)}>
                        Read Email
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>no email found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="email">
          {message ? (
            <div>
              <h2>EMAIL MESSAGE</h2>
              <hr></hr>

              <p>
                {message.data.payload.headers.map((header) => {
                  if (header.name === "From") {
                    return (
                      <span key={header.name}>
                        <b>From : </b>
                        {header.value}
                      </span>
                    );
                  }
                  return null;
                })}
              </p>
              <p>
                {message.data.payload.headers.map((header) => {
                
                  if (header.name === "Subject") {
                    return (
                      <span key={header.name}>
                        <b>Subject : </b>
                       {header.value}
                      </span>
                    );
                  }
                  return null;
                })}
              </p>

              
              <p>
               {message.data.payload.body.data
                  ? Base64.decode(message.data.payload.body.data)
                  : message.data.payload.parts[0].body.data
                  ? Base64.decode(message.data.payload.parts[0].body.data)
                  : Base64.decode(
                      message.data.payload.parts[0].parts[0].body.data
                    )}
              </p>
            </div>
          ) : (
            <p>""</p>
          )}
        </div>
      </div>
    </>
  );
};

export default FetchEmail;


 // const { htmlToText } = require('html-to-text');
//   const text = htmlToText('<div>Nope Its not Ashton Kutcher. It is Kevin Malone. <p>Equally Smart and equally handsome</p></div>');
// console.log(text);

// console.log(msg);
      // console.log("snippet", msg.data.snippet);
      // console.log("headers", msg.data.payload.headers);
      // console.log("payload", msg.data.payload.body.data);
      // console.log("zero", msg.data.payload.parts[0].body.data);
      // console.log("one", msg.data.payload.parts[1].body.data);
      // console.log("decode one",Base64.decode(msg.data.payload.parts[1].body.data))

      // const msgData =JSON.stringify(msg)
      // console.log("msgData",msgData);
      // console.log("msgId",msgId)
      //  console.log("email msg",msg.data.messages);
      //  console.log("emails",emails);