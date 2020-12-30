function uniteProjectBranch(projectPath, branchPath) {
    return projectPath + '_' + branchPath.replace(/\//g, '_')
}

module.exports = {
    uniteProjectBranch
}