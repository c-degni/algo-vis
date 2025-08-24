#pragma once
#include <stack>
#include <vector>
#include <memory>
#include <optional>
#include <string>
#include "../core/ExecutionTracer.h"

s

template<typename T>
class TrackedStack {
    private:
        std::stack<T> stack;
        std::shared_ptr<ExecutionTracer> tracer;

        void recordOp(
            const std::string &op, 
            const std::string &desc, 
            const std::vector<int> &highlights = {}) const;

    public:
        TrackedStack() {
            tracer = std::make_shared<ExecutionTracer>();
            recordOp("init", "stack");
        }

        void push(const T& val);
        std::optional<T> pop();
        std::optional<T> top();
        bool isEmpty(bool track) const;
        int size() const;
        std::string getExecutionTrace() const;
        std::vector<T> getCurrentState() const;
        void clear();
};

template<typename T>
void TrackedStack<T>::recordOp(
    const std::string &op, 
    const std::string &desc, 
    const std::vector<int> &highlights) const
{
    ExecutionStep step;
    step.operation = op;
    step.description = desc;
    step.timestamp = std::chrono::high_resolution_clock::now();
    step.highlights = highlights;

    std::vector<T> state = getCurrentState();
    step.state_snapshot = {
        {"elements", state},
        {"size", stack.size()},
        {"empty", stack.empty()}
    };
    tracer->recordStep(step);
}

// In case val is already a string, compiler will choose proper overload
inline std::string stringify(const std::string& val) {
    return val;
}

template<typename T>
inline std::string stringify(const T& val) {
    return std::to_string(val);
}

template<typename T>
void TrackedStack<T>::push(const T& val) {
    stack.push(val);
    recordOp(
        "push", 
        "Pushed " + stringify(val), 
        {static_cast<int>(stack.size() - 1)}
    );
}

template<typename T>
std::optional<T> TrackedStack<T>::pop() {
    if (stack.empty()) {
        recordOp(
            "stack underflow", 
            "Attempted to pop from empty stack"
        );
        return std::nullopt;
    }
    
    T val = stack.top();
    stack.pop();
    recordOp(
        "pop", 
        "Popped " + stringify(val), 
        {static_cast<int>(stack.size())}
    );
    return val;
}

template<typename T>
std::optional<T> TrackedStack<T>::top() {
    if (stack.empty()) return std::nullopt;

    T val = stack.top();
    recordOp(
        "peek", 
        "Peeked at top: " + stringify(val)
    );
    return val;
}

template<typename T>
bool TrackedStack<T>::isEmpty(bool track) const {
    bool empty = stack.empty();
    if (track) {
        recordOp(
            "empty", 
            "Checked if empty: " + std::string(empty ? "true" : "false")
        );
    }
    return empty;
}

template<typename T>
int TrackedStack<T>::size() const {
    int s = stack.size();
    recordOp(
        "size", 
        std::to_string(s)
    );
    return s;
}

template<typename T>
std::string TrackedStack<T>::getExecutionTrace() const {
    return tracer->getTraceJson();
}

template<typename T>
std::vector<T> TrackedStack<T>::getCurrentState() const {
    std::vector<T> res;
    std::stack<T> tmp = stack;
    while (!tmp.empty()) {
        res.insert(res.begin(), tmp.top());
        tmp.pop();
    }
    return res;
}

template<typename T>
void TrackedStack<T>::clear() {
    while (!stack.empty()) stack.pop();
}