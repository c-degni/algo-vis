#pragma once
#include <memory>
#include <optional>
#include <string>
#include "../core/ExecutionTracer.h"

template<typename T>
class LinkedListNode {
    public:
        LinkedListNode(T val) {
            next = nullptr;
            data = val;
        } 

        T data;
        LinkedListNode<T>* next;
};

template<typename T>
class TrackedLinkedList {
    private:
        LinkedListNode<T>* head;
        int length;
        std::shared_ptr<ExecutionTracer> tracer;

        void recordOp(
            const std::string &op,
            const std::string &desc,
            const std::vector<int> &highlights = {}) const;

        LinkedListNode<T>* findPrevNode(T val);
        LinkedListNode<T>* findNode(T val);
        std::string getExecutionTrace() const;
        std::vector<T> getCurrentState() const;

    public:
        TrackedLinkedList() {
            head = nullptr;
            len = 0;
            tracer = std::make_shared<ExecutionTracer>();
            recordOp("init", "linked-list");
        }

        ~TrackedLinkedList() {
            clear(false);
        }

        void insert(T val);
        std::optional<T> remove(T val);
        std::optional<T> find(T val);
        int size();
        void clear(bool track);
};

template<typename T>
void TrackedLinkedList<T>::recordOp(
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
        {"size", length},
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
std::string TrackedLinkedList<T>::getExecutionTrace() const {
    return tracer->getTraceJson();
}

template<typename T>
std::vector<T> TrackedLinkedList<T>::getCurrentState() const {
    std::vector<T> res;
    LinkedListNode<T>* tmp = head;
    while (tmp != nullptr) {
        res.push_back(tmp->data);
        tmp = tmp->next;
    }
    return res;
}

template<typename T>
LinkedListNode<T>* TrackedLinkedList<T>::findPrevNode(T val) {
    if (head == nullptr) return nullptr;
    
    LinkedListNode<T>* tmp = head;
    while (tmp->next != nullptr) {
        if (tmp->next->data == val) return tmp;
        tmp = tmp->next;
    }

    return nullptr;
}

template<typename T>
LinkedListNode<T>* TrackedLinkedList<T>::findNode(T val) {
    LinkedListNode<T>* prevNode = findPrevNode();
    if (prevNode == nullptr) return nullptr;
    return prevNode->next;
}

template<typename T>
std::optional<T> TrackedLinkedList<T>::find(T val) {
    LinkedListNode<T>* foundNode = findNode();
    if (foundNode == nullptr) return std::nullopt;

    recordOp(
        "find", 
        "Found " + stringify(foundNode->data)
    );
    return foundNode->data;
}

template<typename T>
void TrackedLinkedList<T>::insert(T val) {
    if (head == nullptr) {
        head = new LinkedListNode<T>(val);
        length++;

        recordOp(
            "insert", 
            "Inserted " + stringify(val)
        );
        return;
    }

    while (tmp->next != nullptr) tmp = tmp->next;
    tmp->next = new LinkedListNode<T>(val);

    length++;
    recordOp(
        "insert", 
        "Inserted " + stringify(val)
    );
    return;
}

template<typename T>
std::optional<T> TrackedLinkedList<T>::remove(T val) {
    LinkedListNode<T>* prev = findPrevNode();
    if (prev == nullptr) return std::nullopt;

    LinkedListNode<T>* nodeToRemove = prev->next;
    T removedData = nodeToRemove->data;
    prev->next = nodeToRemove->next;
    free(nodeToRemove);
    length--;

    recordOp(
        "remove", 
        "Removed " + stringify(nodeToRemove->data)
    );
    return removedData;
}

template<typename T>
int TrackedLinkedList<T>::size() {
    recordOp(
        "size", 
        "Size: " + stringify(length)
    );
    return length;
}

template<typename T>
void TrackedLinkedList<T>::clear(bool track) {

    if (head == nullptr) return;

    LinkedListNode<T>* tmp = head;
    while (tmp != nullptr) {
        LinkedListNode<T>* tmp2 = tmp;
        tmp = tmp->next;
        free(tmp2);
    }

    length = 0;
    if (track) {
        recordOp(
            "clear", 
            "Cleared linked list")
        );
    }
}