"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { ITranscript } from "@/app/api/chat/route";
import "./dragDrop.styles.css";
import ErrorAlert from "../ErrorAlert/ErrorAlert";

function DragDrop() {
  const [parsedFile, setParsedFile] = useState<
    undefined | Array<ArrayBuffer>
  >();
  const [transcript, setTranscript] = useState<ITranscript>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | undefined>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onabort = () => setErrorText("File reading was aborted");
      reader.onerror = () => setErrorText('Sorry, there was an error processing your file!');

      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        setParsedFile([arrayBuffer]);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (parsedFile) {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(parsedFile[0]); // Decode binary to string
      axios
        .post("/api/chat", {
          transcript: text,
        })
        .then((res) => {
          setErrorText(undefined);
          setTranscript(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setErrorText(err);
          setIsLoading(false);
        });
    }
  }, [parsedFile]);

  return (
    <div className="flex flex-col px-12 items-center">
      <div {...getRootProps()} className="border-white border-[2px] p-8 rounded-md mt-2 cursor-pointer mb-6 max-w-[455px] dragDropContainer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
      </div>
      {errorText && <ErrorAlert text={errorText} />}
      {isLoading && (
        <iframe src="https://lottie.host/embed/291455ae-275d-45d1-bad1-fc632f943b51/7o6m5He53P.lottie"></iframe>
      )}
      {transcript && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">Summary</h2>
          <p>{transcript.summary}</p>
          <h2 className="text-xl font-bold mt-3">KeyPoints</h2>
          <ul className="pl-2 flex flex-col gap-3">
            {transcript.keyPoints.map((item, index) => (
              <li key={index} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DragDrop;
