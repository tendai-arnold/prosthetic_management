import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [featureFile, setFeatureFile] = useState<FileList | null>();
  const [dataFile, setDataFile] = useState<FileList | null>();
  const [subjectData, setSubjectData] = useState<Array<any>>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const result: any = await fetch("http://localhost:3000/read_subject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    setSubjectData(data);
  };

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        console.log("[reader.result] -> ", reader.result)
        return resolve(reader.result)};
      reader.onerror = (error) => reject(error);
    });

  const addSubject = async () => {
    // TODO: Add subject
    const _featureFile = await toBase64(featureFile?.item(0) as File);
    const _dataFile = await toBase64(dataFile?.item(0) as File);
    const body = {
      subject: subject,
      details: details,
      features: `${_featureFile}`,
      data_set: `${_dataFile}`,
    };
    const _body = JSON.stringify(body);
    console.log("featureFile: ", _featureFile);
    console.log("dataFile: ", _dataFile);
    console.log("body: ", body);
    const result = await fetch("http://localhost:3000/add_subject", {
      method: "POST",
      body: _body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("result: ", result);
    if (result.status === 200) {
      alert("Subject data added successfully!");
    }
  };
  
  const deleteSubject = async(id: string) => {
    const result = await fetch("http://localhost:3000/delete_subject", {
      method: "POST",
      body: JSON.stringify({ id: id }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      alert("Subject data removed successfully!");
      getData();
    }
  }

  return (
      <div className="App">
        <h1>Prosthetic Management</h1>
        <br />
        <br />
        <h3>Subject Name:</h3>
        <input
          type="text"
          placeholder="Subject 1"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
        <br />
        <h3>Details:</h3>
        <input
          type="text"
          placeholder="..."
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
        <br />
        <h3>Features File:</h3>
        <input
          type="file"
          id="input"
          name="avatar"
          onChange={(event) => setFeatureFile(event.target.files)}
        ></input>
        <br />
        <h3>DataSet File:</h3>
        <input
          type="file"
          id="input"
          onChange={(event) => setDataFile(event.target.files)}
        ></input>
        <br />
        <div className="">
        <br />
          <button onClick={() => addSubject()}>Add Subject</button>
        </div>

        <br /><br /><br />
        <h2>Visits</h2>
        <div>
          {
                  subjectData.map((subject, index) => {
                      return (
                          <div className="card" key={index}>
                              <h3>{subject.subject}</h3>
                              <p>{subject.details}</p>
                              <button onClick={() => deleteSubject(subject?.id)}>Delete</button> &nbsp;
                              <button onClick={() => window.open('http://127.0.0.1:8050/?id='+subject?.id)}>View</button>
                          </div>
                      )
                  })
          }
        </div>
      </div>
  );
}

export default App;
