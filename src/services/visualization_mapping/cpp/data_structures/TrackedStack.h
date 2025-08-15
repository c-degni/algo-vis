#ifndef TRACKED_STACK_H
#define TRACKED_STACK_H

#include <stack>
#include <vector>
#include "ExecutionTracer.h"

template<typename T>
class TrackedStack {
    private:
        std::stack<T> stack;
        std::shared_ptr<ExecutionTracer> tracer;

        void recordOp(
            const std::string &op, 
            const std::string &desc, 
            const std::vector<int> &highlights = {});

    public:
        TrackedStack() {
            tracer = std::make_shared<ExecutionTracer>();
            recordOp("init", "stack");
        }

        void push(const T& val);
        T pop();
        T top();
        bool isEmpty();
        int size();
        std::string getExecutionTrace();
        std::vector<T> getCurrentState();
        void clear();
};

template<typename T>
void TrackedStack<T>::recordOp(
    const std::string &op, 
    const std::string &desc, 
    const std::vector<int> &highlights = {})
{
    ExecutionStep step;
    step.operation = op;
    step.description = desc;
    step.timestamp = std::chrono::high_resolution_clock::now();
    step.highlights = highlights;

    T state = getCurrentState();
    step.state_snapshot = {
        {"elements", state},
        {"size", stack.size()},
        {"empty", stack.empty()}
    };
    tracer->recordStep(step);
}

template<typename T>
void TrackedStack<T>::push(const T& val) {
    stack.push(val);
    record_op(
        "push", 
        "Pushed " + std::to_string(val), 
        {static_cast<int>(stack.size() - 1)}
    );
}

template<typename T>
T TrackedStack<T>::pop() {
    if (stack.isEmpty()) {
        record_op(
            "stack underflow", 
            "Attempted to pop from empty stack"
        );
        throw std::runtime_error("Stack is empty");
    }
    
    T val = stack.top();
    stack.pop();
    record_op(
        "pop", 
        "Popped " + std::to_string(value), 
        {static_cast<int>(stack_.size())}
    );
    return val;
}

template<typename T>
T TrackedStack<T>::top() {
    if (stack.isEmpty()) {
        throw std::runtime_error("Stack is empty");
    }

    T val = stack.top();
    record_op(
        "peek", 
        "Peeked at top: " + std::to_string(val)
    );
    return val;
}

template<typename T>
bool TrackedStack<T>::isEmpty() {
    bool empty = stack.empty();
    record_op(
        "check_empty", 
        "Checked if empty: " + std::string(empty ? "true" : "false")
    );
    return empty;
}

template<typename T>
int TrackedStack<T>::size() {
    int s = stack.size();
    record_op(
        "Size:", 
        std::to_string(s)
    );
    return s;
}

template<typename T>
std::string TrackedStack<T>::getExecutionTrace() {
    return tracer->getTraceJson();
}

template<typename T>
std::vector<T> TrackedStack<T>::getCurrentState() {
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
    int s = size();
    for (int i = 0; i < s; i++) {
        stack.pop();
    }
}

#endif