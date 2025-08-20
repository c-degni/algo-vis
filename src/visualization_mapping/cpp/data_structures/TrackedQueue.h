#pragma once 
#include <queue>
#include <memory>
#include <optional>
#include <vector>
#include <string>
#include "../core/ExecutionTracer.h"

template<typename T>
class TrackedQueue {
    private:
        std::queue<T> queue;
        std::shared_ptr<ExecutionTracer> tracer;

        void recordOp(
            const std::string &op,
            const std::string &desc,
            const std::vector<int> &highlights = {}) const;

    public:
        TrackedQueue() {
            tracer = std::make_shared<ExecutionTracer>();
            recordOp("init", "queue");
        }

        void enqueue(const T& val);
        std::optional<T> dequeue();
        std::optional<T> front();
        bool isEmpty(bool track) const;
        int size() const;
        std::string getExecutionTrace() const;
        std::vector<T> getCurrentState() const;
        void clear();
};

template<typename T>
void TrackedQueue<T>::recordOp(
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
        {"size", queue.size()},
        {"empty", queue.empty()}
    };
    tracer->recordStep(step);
}

inline std::string stringify(const std::string& val) {
    return val;
}

template<typename T>
inline std::string stringify(const T& val) {
    return std::to_string(val);
}

template<typename T>
void TrackedQueue<T>::enqueue(const T& val) {
    queue.push(val);
    recordOp(
        "enqueue", 
        "Enqueued " + stringify(val), 
        {static_cast<int>(queue.size() - 1)}
    );
}

template<typename T>
std::optional<T> TrackedQueue<T>::dequeue() {
    if (queue.empty()) {
        recordOp(
            "queue underflow", 
            "Attempted to dequeue from empty queue"
        );
        return std::nullopt;
    }
    
    T val = queue.front();
    queue.pop();
    recordOp(
        "dequeue", 
        "Dequeued " + stringify(val), 
        {static_cast<int>(queue.size())}
    );
    return val;
}

template<typename T>
std::optional<T> TrackedQueue<T>::front() {
    if (queue.empty()) return std::nullopt;

    T val = queue.front();
    recordOp(
        "front", 
        "Peeked at front: " + stringify(val)
    );
    return val;
}

template<typename T>
bool TrackedQueue<T>::isEmpty(bool track) const {
    bool empty = queue.empty();
    if (track) {
        recordOp(
            "empty", 
            "Checked if empty: " + std::string(empty ? "true" : "false")
        );
    }
    return empty;
}

template<typename T>
int TrackedQueue<T>::size() const {
    int s = queue.size();
    recordOp(
        "size", 
        std::to_string(s)
    );
    return s;
}

template<typename T>
std::string TrackedQueue<T>::getExecutionTrace() const {
    return tracer->getTraceJson();
}

template<typename T>
std::vector<T> TrackedQueue<T>::getCurrentState() const {
    std::vector<T> res;
    std::queue<T> tmp = queue;
    while (!tmp.empty()) {
        res.push_back(tmp.front());
        tmp.pop();
    }
    return res;
}

template<typename T>
void TrackedQueue<T>::clear() {
    while (!queue.empty()) queue.pop();
}