
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Code, Play, Save, Terminal, ChevronRight, AlertCircle, Lock, Maximize, Minimize } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CodingAssessment: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(codingQuestions[0]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(45 * 60); // 45 minutes in seconds
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  // Initialize code with template based on selected language
  useEffect(() => {
    setCode(getCodeTemplate(language, selectedQuestion));
  }, [language, selectedQuestion]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          toast({
            title: "Time's up!",
            description: "Your assessment time has ended.",
            variant: "destructive",
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Run code
  const runCode = async () => {
    setIsLoading(true);
    setOutput("");
    
    try {
      // Using the Judge0 API for code compilation
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "YOUR_RAPIDAPI_KEY", // This would be stored securely in a real app
        },
        body: JSON.stringify({
          source_code: code,
          language_id: getLanguageId(language),
          stdin: selectedQuestion.testInput,
        }),
      });
      
      // Simulate API response for demo purposes
      setTimeout(() => {
        // Mock successful compilation
        if (code.includes(selectedQuestion.solutionPattern)) {
          setOutput("Test cases passed: 4/4\nOutput: " + selectedQuestion.expectedOutput);
          if (!completedQuestions.includes(selectedQuestion.id)) {
            setCompletedQuestions(prev => [...prev, selectedQuestion.id]);
            toast({
              title: "Success!",
              description: "Your solution passed all test cases!",
            });
          }
        } else {
          setOutput("Test cases passed: 1/4\nError on test case 2: Expected " + 
            selectedQuestion.expectedOutput + " but got undefined.");
          setRemainingAttempts(prev => Math.max(0, prev - 1));
          toast({
            title: "Some tests failed",
            description: "Check your solution and try again.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error running code. Please try again.");
      setIsLoading(false);
    }
  };

  // Get language ID for Judge0 API
  const getLanguageId = (lang: string) => {
    const ids: Record<string, number> = {
      javascript: 63,
      python: 71,
      java: 62,
      cpp: 54,
    };
    return ids[lang] || 63;
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-white p-4 overflow-auto' : ''}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Coding Assessment</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(remainingTime)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            <span>{remainingAttempts} attempts left</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>Select a coding challenge to solve</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              {codingQuestions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => setSelectedQuestion(question)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedQuestion.id === question.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{question.title}</h3>
                    {completedQuestions.includes(question.id) ? (
                      <Badge className="bg-green-500">Completed</Badge>
                    ) : (
                      <Badge variant="outline">{question.difficulty}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{question.description.substring(0, 60)}...</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Coding area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedQuestion.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline">{selectedQuestion.difficulty}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{selectedQuestion.timeLimit} min</span>
                    </Badge>
                  </CardDescription>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{selectedQuestion.description}</p>
                
                <h4>Example:</h4>
                <div className="my-2 p-3 bg-gray-50 rounded-md text-sm">
                  <p><strong>Input:</strong> {selectedQuestion.example.input}</p>
                  <p><strong>Output:</strong> {selectedQuestion.example.output}</p>
                </div>
                
                <h4>Constraints:</h4>
                <ul className="list-disc pl-5">
                  {selectedQuestion.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code">Code Editor</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="p-0 mt-4">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm h-80 bg-gray-50"
                    style={{ resize: "vertical" }}
                  />
                </TabsContent>
                <TabsContent value="output" className="p-0 mt-4">
                  <div className="font-mono text-sm bg-gray-900 text-white p-4 rounded-md h-80 overflow-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse">Compiling...</div>
                      </div>
                    ) : output ? (
                      <pre>{output}</pre>
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                        <Terminal className="h-6 w-6 mb-2" />
                        <p>Run your code to see output here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                {remainingAttempts === 0 ? (
                  <div className="flex items-center text-red-500">
                    <Lock className="h-3 w-3 mr-1" />
                    <span>No attempts remaining</span>
                  </div>
                ) : (
                  <span>Type your solution and run to test</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={runCode} 
                  disabled={isLoading || remainingAttempts === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Run Code
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Sample coding questions
const codingQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    timeLimit: 15,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    example: {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
    },
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists.",
    ],
    testInput: "[2,7,11,15], 9",
    expectedOutput: "[0,1]",
    solutionPattern: "return [0, 1]",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Medium",
    timeLimit: 20,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    example: {
      input: "s = \"()[]{}\"",
      output: "true",
    },
    constraints: [
      "1 <= s.length <= 104",
      "s consists of parentheses only '()[]{}'.",
    ],
    testInput: "()[]{}",
    expectedOutput: "true",
    solutionPattern: "return true",
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Medium",
    timeLimit: 25,
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list. Implement the solution without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)",
    example: {
      input: "head = [1,2,3,4,5]",
      output: "[5,4,3,2,1]",
    },
    constraints: [
      "The number of nodes in the list is the range [0, 5000]",
      "-5000 <= Node.val <= 5000",
    ],
    testInput: "[1,2,3,4,5]",
    expectedOutput: "[5,4,3,2,1]",
    solutionPattern: "return prev",
  },
  {
    id: 4,
    title: "Binary Search",
    difficulty: "Easy",
    timeLimit: 15,
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    example: {
      input: "nums = [-1,0,3,5,9,12], target = 9",
      output: "4",
    },
    constraints: [
      "1 <= nums.length <= 104",
      "-104 < nums[i], target < 104",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    testInput: "[-1,0,3,5,9,12], 9",
    expectedOutput: "4",
    solutionPattern: "return 4",
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Hard",
    timeLimit: 30,
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.",
    example: {
      input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
    },
    constraints: [
      "1 <= nums.length <= 105",
      "-104 <= nums[i] <= 104",
    ],
    testInput: "[-2,1,-3,4,-1,2,1,-5,4]",
    expectedOutput: "6",
    solutionPattern: "return 6",
  }
];

// Get code template based on language
const getCodeTemplate = (language: string, question: typeof codingQuestions[0]) => {
  switch (language) {
    case "javascript":
      return `/**
 * ${question.title}
 * ${question.description}
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
  
}

// Example usage:
// console.log(twoSum([2,7,11,15], 9)); // Should return [0,1]`;

    case "python":
      return `"""
${question.title}
${question.description}
"""

def two_sum(nums, target):
    # Your solution here
    pass

# Example usage:
# print(two_sum([2,7,11,15], 9)) # Should return [0,1]`;

    case "java":
      return `/**
 * ${question.title}
 * ${question.description}
 */
 
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{0, 0};
    }
    
    // Example usage:
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.twoSum(new int[]{2,7,11,15}, 9);
        // Should return [0,1]
    }
}`;

    case "cpp":
      return `/**
 * ${question.title}
 * ${question.description}
 */
 
#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {0, 0};
    }
};

// Example usage:
// int main() {
//     Solution solution;
//     vector<int> nums = {2,7,11,15};
//     vector<int> result = solution.twoSum(nums, 9);
//     // Should return [0,1]
//     return 0;
// }`;

    default:
      return "";
  }
};

export default CodingAssessment;
