#pragma once
#include <memory>
#include <optional>
#include <string>
#include <algorithm>
#include "../core/ExecutionTracer.h"

template<typename T>
class BinaryTreeNode {
    public:
        BinaryTreeNode(T val) {
            data = val;
            left = nullptr;
            right = nullptr;
        }

        BinaryTreeNode(T val, BinaryTreeNode<T>* l, BinaryTreeNode<T>* r) {
            data = val;
            left = l;
            right = r;
        }

        T data;
        BinaryTreeNode<T>* left;
        BinaryTreeNode<T>* right;
};

template<typename T>
class TrackedBinaryTree {
    private:
        BinaryTreeNode<T>* root;
        int numOfElems;
        std::shared_ptr<ExecutionTracer> tracer;

        void recordOp(
            const std::string &op,
            const std::string &desc,
            const std::vector<int> &highlights = {}) const;
        void insert(T val, BinaryTreeNode<T>* node);
        BinaryTreeNode<T>* findNode(T val, BinaryTreeNode<T>* node);
        BinaryTreeNode<T>* findNode(T val);
        BinaryTreeNode<T>* findNodeParent(T val, BinaryTreeNode<T>* node);
        BinaryTreeNode<T>* findNodeParent(T val);
        int getHeight(BinaryTreeNode<T>* node);
        void clear(BinaryTreeNode<T>* node);
        std::vector<T> inorder(std::vector<T> tree, BinaryTreeNode<T>* node) const;
        std::vector<T> preorder(std::vector<T> tree, BinaryTreeNode<T>* node) const;
        std::vector<T> postorder(std::vector<T> tree, BinaryTreeNode<T>* node) const;

    public: 
        TrackedBinaryTree() {
            root = nullptr;
            numOfElems = 0;
            tracer = std::make_shared<ExecutionTracer>();
            recordOp("init", "binarytree");
        }

        ~TrackedBinaryTree() {
            clear();
        }

        void insert(T val);
        std::optional<T> remove(T val);
        std::optional<T> find(T val);
        int getHeight();
        int size();
        std::string preorder();
        std::string inorder();
        std::string postorder();
        bool inTree(T val);
        std::string getExecutionTrace() const;
        std::vector<T> getCurrentState_Inorder() const;
        std::vector<T> getCurrentState_Preorder() const;
        void clear();
};

template<typename T>
void TrackedBinaryTree<T>::recordOp(
    const std::string &op, 
    const std::string &desc, 
    const std::vector<int> &highlights) const
{
    ExecutionStep step;
    step.operation = op;
    step.description = desc;
    step.timestamp = std::chrono::high_resolution_clock::now();
    step.highlights = highlights;

    std::vector<T> stateInorder = getCurrentState_Inorder();
    std::vector<T> statePreorder = getCurrentState_Preorder();
    step.state_snapshot = {
        {"inorder", stateInorder},
        {"preorder", statePreorder},
        {"size", numOfElems},
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
std::string TrackedBinaryTree<T>::getExecutionTrace() const {
    return tracer->getTraceJson();
}

template<typename T>
std::vector<T> TrackedBinaryTree<T>::inorder(std::vector<T> tree, BinaryTreeNode<T>* node) const {
    // Base
    if (node == nullptr) return tree;

    tree = inorder(tree, node->left);
    tree.push_back(node->data);
    tree = inorder(tree, node->right);

    return tree;
}

template<typename T>
std::string TrackedBinaryTree<T>::inorder() {
    std::vector<T> res;
    res = inorder(res, root);

    std::string str;
    for (T item : res) str += stringify(item);
    
    recordOp(
        "inorder",
        "Inorder: " + stringify(str)
    );
    return str;
}

template<typename T>
std::vector<T> TrackedBinaryTree<T>::preorder(std::vector<T> tree, BinaryTreeNode<T>* node) const {
    // Base
    if (node == nullptr) return tree;

    tree.push_back(node->data);
    tree = preorder(tree, node->left);
    tree = preorder(tree, node->right);

    return tree;
}

template<typename T>
std::string TrackedBinaryTree<T>::preorder() {
    std::vector<T> res;
    res = preorder(res, root);

    std::string str;
    for (T item : res) str += stringify(item);
    
    recordOp(
        "preorder",
        "Preorder: " + stringify(str)
    );
    return str;
}

template<typename T>
std::vector<T> TrackedBinaryTree<T>::postorder(std::vector<T> tree, BinaryTreeNode<T>* node) const {
    // Base
    if (node == nullptr) return tree;

    tree = postorder(tree, node->left);
    tree = postorder(tree, node->right);
    tree.push_back(node->data);

    return tree;
}

template<typename T>
std::string TrackedBinaryTree<T>::postorder() {
    std::vector<T> res;
    res = postorder(res, root);

    std::string str;
    for (T item : res) str += (stringify(item) + " ");
    
    recordOp(
        "postorder",
        "Postorder: " + stringify(str)
    );
    return str;
}

template<typename T>
std::vector<T> TrackedBinaryTree<T>::getCurrentState_Inorder() const {
    std::vector<T> tree;
    return inorder(tree, root);
}

template<typename T>
std::vector<T> TrackedBinaryTree<T>::getCurrentState_Preorder() const {
    std::vector<T> tree;
    return preorder(tree, root);
}

template<typename T>
void TrackedBinaryTree<T>::insert(T val, BinaryTreeNode<T>* node) {
    // Base
    if (node == root && root == nullptr) {
        root = new BinaryTreeNode<T>(val);
        return;
    }

    // Insertion
    if (node->data > val) {
        if (node->left == nullptr) {
            node->left = new BinaryTreeNode<T>(val);
        } else {
            insert(val, node->left);
        }
    } else {
        if (node->right == nullptr) {
            node->right = new BinaryTreeNode<T>(val);
        } else {
            insert(val, node->right);
        }
    }
}

template<typename T>
void TrackedBinaryTree<T>::insert(T val) {
    insert(val, root);
    recordOp(
        "insert",
        "Inserted " + stringify(val)
    );
    numOfElems++;
}

template<typename T>
BinaryTreeNode<T>* TrackedBinaryTree<T>::findNodeParent(T val, BinaryTreeNode<T>* node) {
    // Base
    if (node == nullptr) return nullptr;
    if ((node->left != nullptr && node->left->data == val) || (node->right != nullptr && node->right->data == val)) return node;

    // Recursive
    if (node->data > val) {
        return findNodeParent(val, node->left);
    } else {
        return findNodeParent(val, node->right);
    }
}

template<typename T>
BinaryTreeNode<T>* TrackedBinaryTree<T>::findNodeParent(T val) {
    return findNodeParent(val, root);
}

template<typename T>
std::optional<T> TrackedBinaryTree<T>::remove(T val) {
    BinaryTreeNode<T>* nodeToRemove = findNode(val);
    if (nodeToRemove == nullptr) return std::nullopt;
    T removedData = nodeToRemove->data;

    if (nodeToRemove == root) {
        if (root->left == nullptr && root->right == nullptr) {
            delete root;
            root = nullptr;
        } else if (root->left != nullptr && root->right == nullptr) {
            BinaryTreeNode<T>* tmp = root->left;
            delete root;
            root = tmp;
        } else if (root->left == nullptr && root->right != nullptr) {
            BinaryTreeNode<T>* tmp = root->right;
            delete root;
            root = tmp;
        } else if (root->left != nullptr && root->right != nullptr) {
            BinaryTreeNode<T>* leftChildSubtree = root->left;
            BinaryTreeNode<T>* tmp = root->right;

            while (tmp->left != nullptr) tmp = tmp->left;
            tmp->left = leftChildSubtree->right;
            leftChildSubtree->right = root->right;

            delete root;
            root = leftChildSubtree;
        }
    }  else {
        BinaryTreeNode<T>* parent = findNodeParent(val);
        if (nodeToRemove->left == nullptr && nodeToRemove->right == nullptr) {
            if (parent->data > val) {
                parent->left = nullptr;
            } else if (parent->data <= val) {
                parent->right = nullptr;
            }
        } else if (nodeToRemove->left != nullptr && nodeToRemove->right == nullptr) {
            if (parent->data > val) {
                parent->left = nodeToRemove->left;
            } else if (parent->data <= val) {
                parent->right = nodeToRemove->left;
            }
        } else if (nodeToRemove->left == nullptr && nodeToRemove->right != nullptr) {
            if (parent->data > val) {
                parent->left = nodeToRemove->right;
            } else if (parent->data <= val) {
                parent->right = nodeToRemove->right;
            }
        } else if (nodeToRemove->left != nullptr && nodeToRemove->right != nullptr) {
            if (parent->data > val) {
                parent->left = nodeToRemove->right;
            } else if (parent->data <= val) {
                parent->right = nodeToRemove->right;
            }

            BinaryTreeNode<T>* tmp = nodeToRemove->right;
            while (tmp->left != nullptr) tmp = tmp->left;
            tmp->left = nodeToRemove->left;
        }
        delete nodeToRemove;
    }

    recordOp(
        "remove",
        "Removed " + stringify(val)
    );
    numOfElems--;
    return removedData;
}

template<typename T>
BinaryTreeNode<T>* TrackedBinaryTree<T>::findNode(T val, BinaryTreeNode<T>* node) {
    // Base
    if (node == nullptr) return nullptr;
    if (node->data == val) return node;

    // Recursive
    if (node->data > val) return findNode(val, node->left);
    return findNode(val, node->right);
}

template<typename T>
BinaryTreeNode<T>* TrackedBinaryTree<T>::findNode(T val) {
    return findNode(val, root);
}

template<typename T>
std::optional<T> TrackedBinaryTree<T>::find(T val) {
    BinaryTreeNode<T>* foundNode = findNode(val);
    if (foundNode == nullptr) return std::nullopt;
    recordOp(
        "find",
        "Found " + stringify(val)
    );
    return foundNode->data;
}

template<typename T>
bool TrackedBinaryTree<T>::inTree(T val) {
    return findNode(val) != nullptr;
}

template<typename T>
int TrackedBinaryTree<T>::getHeight(BinaryTreeNode<T>* node) {
    // Base
    if (node == nullptr) return 0;

    // Recursive
    int leftSubtreeHeight = getHeight(node->left);
    int rightSubtreeHeight = getHeight(node->right);

    // Count
    return std::max(leftSubtreeHeight, rightSubtreeHeight) + 1;
}

template<typename T>
int TrackedBinaryTree<T>::getHeight() {
    int height = getHeight(root);
    recordOp(
        "getHeight",
        "Height: " + stringify(height)
    );
    return height;
}

template<typename T>
int TrackedBinaryTree<T>::size() {
    recordOp(
        "size",
        "Size: " + stringify(numOfElems)
    );
    return numOfElems;
}

template<typename T>
void TrackedBinaryTree<T>::clear(BinaryTreeNode<T>* node) {
    // Base
    if (node == nullptr) return;
    clear(node->left);
    clear(node->right);
    delete node;
}

template<typename T>
void TrackedBinaryTree<T>::clear() {
    clear(root);
    root = nullptr;
    numOfElems = 0;
}