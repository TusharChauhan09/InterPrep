import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMedia } from "use-media";

const CodeEditor = () => {
  const isSmallScreen = useMedia({ maxWidth: 640 });
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"java" | "python" | "javascript">(
    LANGUAGES[0].id
  );
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (
    newLanguage: "javascript" | "python" | "java"
  ) => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction={isSmallScreen ? "vertical" : "horizontal"} >
        <ResizablePanel
          defaultSize={45}
          minSize={35}
          maxSize={100}
          className="relative"
        >
          <ScrollArea className="h-full">
            <div className="h-full min-h-0 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {selectedQuestion.title}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your language and solve the problem
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={selectedQuestion.id}
                      onValueChange={handleQuestionChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {CODING_QUESTIONS.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-[150px]">
                        {/* SELECT VALUE */}
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${language}.png`}
                              alt={language}
                              className="w-5 h-5 object-contain"
                            />
                            {LANGUAGES.find((l) => l.id === language)?.name}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      {/* SELECT CONTENT */}
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={`/${lang.id}.png`}
                                alt={lang.name}
                                className="w-5 h-5 object-contain"
                              />
                              {lang.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* PROBLEM DESC. */}
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <BookIcon className="h-5 w-5 text-primary/80" />
                    <CardTitle>Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">
                        {selectedQuestion.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* PROBLEM EXAMPLES */}
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                    <CardTitle>Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedQuestion.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-sm">
                            Example {index + 1}:
                          </p>
                          <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap">
                            <div>Input: {example.input}</div>
                            <div>Output: {example.output}</div>
                            {example.explanation && (
                              <div className="pt-2 text-muted-foreground">
                                Explanation: {example.explanation}
                              </div>
                            )}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CONSTRAINTS */}
                {selectedQuestion.constraints && (
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                      <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                      <CardTitle>Constraints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                        {selectedQuestion.constraints.map(
                          (constraint, index) => (
                            <li key={index} className="text-muted-foreground">
                              {constraint}
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55} minSize={35} className="p-3 border m-2 bg-[#1E1E1E] rounded-3xl">
          <Editor
            height={"100%"}
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 18,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
