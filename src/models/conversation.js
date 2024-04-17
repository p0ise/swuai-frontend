class Node {
    constructor(role, content, parent = null) {
        this.role = role;       // 角色（例如：用户、系统）
        this.content = content; // 内容
        this.children = [];     // 子节点数组
        this.parent = parent;   // 父节点引用
    }

    getFirstLeaf() {
        let node = this;
        while (node.children.length > 0) {
            node = node.children[0];
        }
        return node;
    }

    addChild(node) {
        node.parent = this;
        this.children.push(node);
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index !== -1) {
            this.children.splice(index, 1);
            node.parent = null;
        } else {
            console.error('指定的节点不存在');
        }
    }

    addSibling(node) {
        if (this.parent) {
            this.parent.addChild(node);
        } else {
            console.error('根节点不能添加兄弟节点');
        }
    }

    getSiblings() {
        if (this.parent) {
            return this.parent.children;
        }
        return [];
    }

    indexOfSiblings() {
        if (this.parent) {
            return this.parent.children.indexOf(this);
        } else {
            return -1;
        }
    }

    prevSibling() {
        if (this.parent) {
            const index = this.indexOfSiblings();
            if (index > 0) {
                return this.parent.children[index - 1];
            }
        }
        return null;
    }

    nextSibling() {
        if (this.parent) {
            const index = this.indexOfSiblings();
            if (index < this.parent.children.length - 1) {
                return this.parent.children[index + 1];
            }
        }
        return null;
    }
}

class Conversation {
    constructor(title) {
        this.title = title;
        this.root = new Node('Virtual Root', '');  // 存储所有根节点的数组
        this.currentLeaf = this.root; // 当前节点，根据对话流程更新
    }

    // 设置当前对话节点
    setCurrentLeaf(node) {
        this.currentLeaf = node.getFirstLeaf();
    }

    // 获取当前节点的路径
    getPath(node = this.currentLeaf) {
        let path = [];
        while (node && node.parent) {
            path.unshift(node);
            node = node.parent;
        }
        return path;
    }

    getMessages(node = this.currentLeaf) {
        let messages = [];
        while (node && node.parent) {
            messages.unshift({ role: node.role, content: node.content });
            node = node.parent;
        }
        return messages;
    }

    removeNode(node) {
        if (!node) {
            console.error('指定的节点不存在');
            return;
        }
        if (!node.parent) {
            console.error('根节点不能删除');
            return;
        }

        const parent = node.parent;
        parent.removeChild(node);
        this.setCurrentLeaf(parent);
    }

    addChild(node, parent = this.currentLeaf) {
        parent.addChild(node);
        this.setCurrentLeaf(node);
    }

    addSibling(node, sibling = this.currentLeaf) {
        sibling.addSibling(node);
        this.setCurrentLeaf(node);
    }

    navigateTo(node) {
        console.log("navigateTo", node)
        if (!node) {
            console.error('指定的节点不存在');
            return;
        }
        if (!node.parent) {
            console.error('根节点不能导航');
            return;
        }

        this.setCurrentLeaf(node);
    }
}


export { Conversation, Node };
