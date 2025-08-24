#pragma once
#include <optional>

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

        LinkedListNode<T>* findPrevNode(T val);
        LinkedListNode<T>* findNode(T val);

    public:
        TrackedLinkedList() {
            head = nullptr;
            len = 0;
        }

        ~TrackedLinkedList() {
            clear();
        }

        void insert(T val);
        std::optional<T> remove(T val);
        std::optional<T> find(T val);
        int size();
        void clear();
};

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
    return foundNode->data;
}

template<typename T>
void TrackedLinkedList<T>::insert(T val) {
    if (head == nullptr) {
        head = new LinkedListNode<T>(val);
        length++;
        return;
    }

    while (tmp->next != nullptr) tmp = tmp->next;
    tmp->next = new LinkedListNode<T>(val);
    length++;
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
    return removedData;
}

template<typename T>
int TrackedLinkedList<T>::size(T val) {
    return length;
}

template<typename T>
void TrackedLinkedList<T>::clear(T val) {
    if (head == nullptr) return;

    LinkedListNode<T>* tmp = head;
    while (tmp != nullptr) {
        LinkedListNode<T>* tmp2 = tmp;
        tmp = tmp->next;
        free(tmp2);
    }

    length = 0;
}