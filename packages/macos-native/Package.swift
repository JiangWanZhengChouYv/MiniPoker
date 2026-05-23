// swift-tools-version: 5.7

import PackageDescription

let package = Package(
    name: "MiniPoker",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .executable(
            name: "MiniPoker",
            targets: ["MiniPoker"]
        )
    ],
    targets: [
        .executableTarget(
            name: "MiniPoker",
            path: "Sources"
        )
    ]
)
