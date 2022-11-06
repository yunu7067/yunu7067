/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_fs_1 = __webpack_require__(1);
const boxs_1 = __webpack_require__(2);
const github_1 = __webpack_require__(14);
const logger_1 = __webpack_require__(4);
const strings_1 = __webpack_require__(5);
const START_COMMENT = strings_1.strings.start;
const END_COMMENT = strings_1.strings.end;
const REGEXP_BLOCK = new RegExp(`${START_COMMENT}((.|\n)*?)${END_COMMENT}`);
(async () => {
    /* dotenv */
    (await Promise.resolve().then(() => __importStar(__webpack_require__(16)))).config();
    (0, logger_1.log)(process.env.GH_TOKEN);
    const userData = await (0, github_1.getUserData)();
    const gitHubStatsBox = await (0, boxs_1.generateGitHubStatsBox)(userData);
    const productiveBoxString = await (0, boxs_1.generateProductiveBox)(userData);
    const updatedBox = await (0, boxs_1.generateUpdatedBox)();
    const wakaBoxString = await (0, boxs_1.generateWakaBox)({
        WakatimeApiKey: process.env.WAKATIME_API_KEY || "",
    });
    /**
     * Update README.md
     */
    const readme = (0, node_fs_1.readFileSync)("README.md", { encoding: "utf-8", flag: "r" });
    const updatedReadme = readme.replace(REGEXP_BLOCK, [
        START_COMMENT,
        gitHubStatsBox,
        productiveBoxString,
        wakaBoxString,
        updatedBox,
        END_COMMENT,
    ].join("\n\n"));
    (0, node_fs_1.writeFileSync)("README.md", updatedReadme, {
        encoding: "utf-8",
        flag: "w+",
    });
})();


/***/ }),
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3), exports);
__exportStar(__webpack_require__(6), exports);
__exportStar(__webpack_require__(10), exports);
__exportStar(__webpack_require__(11), exports);


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateGitHubStatsBox = void 0;
const logger_1 = __webpack_require__(4);
const strings_1 = __webpack_require__(5);
const BOX_TITLE = strings_1.strings.boxs["github-stats-box"].title;
const COUNT_ALL_COMMITS = process.env.COUNT_ALL_COMMITS === "true" || true;
// function getStats(stats: any, user: any) {
//   stats.totalCommits = user.contributionsCollection.totalCommitContributions;
//   if (countAllCommits) {
//     stats.totalCommits = await totalCommitsFetcher(user.login, githubToken);
//   }
// }
async function generateGitHubStatsBox(userData) {
    const stats = {
        name: userData.name || userData.username,
        totalPRs: userData?.pullRequests?.totalCount || 0,
        totalIssues: userData?.issues?.totalCount || 0,
        contributedTo: userData?.repositoriesContributedTo?.totalCount || 0,
        totalStars: userData.repositories.nodes.reduce((total, cur) => total +
            cur?.stargazers?.totalCount, 0),
        totalCommits: userData?.contributionsCollection?.totalCommitContributions || 0,
    };
    (0, logger_1.log)(stats);
    // log(userData);
    // userData.repositories.nodes.map((node) => log(node));
    const rows = [
        ["⭐", "Total Stars:", stats.totalStars],
        ["➕", "Total Commits:", stats.totalCommits],
        ["🔀", "Total PRs:", stats.totalPRs],
        ["🚩", "Total Issues:", stats.totalIssues],
        ["📦", "Contributed to:", stats.contributedTo],
    ];
    const lines = rows
        .map((label) => [
        label[0],
        " ",
        label[1].padEnd(18),
        label[2]
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            .padStart(30),
    ].join(""))
        .join("\n");
    // log({ lines });
    const full_string = [BOX_TITLE, `\`\`\`text\n${lines}\n\`\`\``].join("\n");
    return full_string;
}
exports.generateGitHubStatsBox = generateGitHubStatsBox;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.log = void 0;
const log = (msg, level) => process.env.DEBUG_MODE === "true" && console[level || "debug"](msg);
exports.log = log;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.strings = void 0;
const strings = {
    start: "<!--START_SECTION:msrm-->",
    end: "<!--END_SECTION:msrm-->",
    boxs: {
        "github-stats-box": {
            title: "My GitHub Stats",
        },
        "productive-box": {
            title: "**I'm an early 🐤**",
        },
        "waka-box": {
            title: "📊 **This Week I Spent My Time On**",
        },
    },
};
exports.strings = strings;


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateProductiveBox = void 0;
const generateBarChart_1 = __importDefault(__webpack_require__(7));
const logger_1 = __webpack_require__(4);
const queries_1 = __webpack_require__(8);
const query_1 = __webpack_require__(9);
const strings_1 = __webpack_require__(5);
const BOX_TITLE = strings_1.strings.boxs["productive-box"].title;
async function generateProductiveBox({ username, id, }) {
    /**
     * Second, get contributed repos
     */
    const contributedRepoQuery = (0, queries_1.createContributedRepoQuery)(username);
    const repoResponse = await (0, query_1.query)(contributedRepoQuery).catch((error) => console.error(`Unable to get the contributed repo\n${error}`));
    const repos = repoResponse?.data?.user?.repositoriesContributedTo?.nodes
        .filter((repoInfo) => !repoInfo?.isFork)
        .map((repoInfo) => ({
        name: repoInfo?.name,
        owner: repoInfo?.owner?.login,
    }));
    // log({ repos });
    /**
     * Third, get commit time and parse into commit-time/hour diagram
     */
    const committedTimeResponseMap = await Promise.all(repos.map(({ name, owner }) => (0, query_1.query)((0, queries_1.createCommittedDateQuery)(id, name, owner)))).catch((error) => console.error(`Unable to get the commit info\n${error}`));
    // const a = await (({ name, owner }) =>
    //   query(createCommittedDateQuery(id, name, owner)))(repos[0]);
    // log(a);
    // log(committedTimeResponseMap);
    if (!committedTimeResponseMap)
        return;
    let morning = 0; // 6 - 12
    let daytime = 0; // 12 - 18
    let evening = 0; // 18 - 24
    let night = 0; // 0 - 6
    committedTimeResponseMap.forEach((committedTimeResponse) => {
        committedTimeResponse?.data?.repository?.defaultBranchRef?.target?.history?.edges.forEach((edge) => {
            const committedDate = edge?.node?.committedDate;
            const timeString = new Date(committedDate).toLocaleTimeString("en-US", {
                hour12: false,
                timeZone: process.env.TIMEZONE,
            });
            const hour = +timeString.split(":")[0];
            /* voting and counting  */
            if (hour < 6)
                night++;
            else if (hour < 12)
                morning++;
            else if (hour < 18)
                daytime++;
            else
                evening++;
        });
    });
    (0, logger_1.log)({ morning, daytime, evening, night });
    /**
     * Next, generate diagram
     */
    const sum = morning + daytime + evening + night;
    const oneDay = [
        { label: "🌞 Morning", commits: morning },
        { label: "🌆 Daytime", commits: daytime },
        { label: "🌃 Evening", commits: evening },
        { label: "🌙 Night", commits: night },
    ];
    // log({ sum, oneDay });
    const lines = oneDay
        .map(({ label, commits }) => {
        const percent = (commits / sum) * 100;
        const line = [
            `${label}`.padEnd(11),
            `${commits.toString().padStart(5)} commits`.padEnd(15),
            (0, generateBarChart_1.default)(percent, 21),
            percent.toFixed(1).padStart(5) + "%",
        ].join(" ");
        return line;
    })
        .join("\n");
    // log({ lines });
    const full_string = [BOX_TITLE, `\`\`\`text\n${lines}\n\`\`\``].join("\n");
    return full_string;
}
exports.generateProductiveBox = generateProductiveBox;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * clone from https://github.com/matchai/waka-box
 */
function generateBarChart(percent, size) {
    const syms = "░▏▎▍▌▋▊▉█";
    const frac = Math.floor((size * 8 * percent) / 100);
    const barsFull = Math.floor(frac / 8);
    if (barsFull >= size) {
        return syms.substring(8, 9).repeat(size);
    }
    const semi = frac % 8;
    return [syms.substring(8, 9).repeat(barsFull), syms.substring(semi, semi + 1)]
        .join("")
        .padEnd(size, syms.substring(0, 1));
}
exports["default"] = generateBarChart;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createCommittedDateQuery = exports.createContributedRepoQuery = exports.userInfoQuery = void 0;
exports.userInfoQuery = `
query userInfo {
  viewer {
    name
    login
    id
    contributionsCollection {
      totalCommitContributions
    }
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
    pullRequests(first: 1) {
      totalCount
    }
    issues(first: 1) {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {direction: DESC, field: STARGAZERS}) {
      totalCount
      nodes {
        stargazers {
          totalCount
        }
      }
    }
  }
}`;
const createContributedRepoQuery = (username) => `
query {
  user(login: "${username}") {
    repositoriesContributedTo(last: 100, includeUserRepositories: true) {
      nodes {
        isFork
        name
        owner {
          login
        }
      }
    }
  }
}`;
exports.createContributedRepoQuery = createContributedRepoQuery;
const createCommittedDateQuery = (id, name, owner) => `
query {
  repository(owner: "${owner}", name: "${name}") {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 100, author: { id: "${id}" }) {
            edges {
              node {
                committedDate
              }
            }
          }
        }
      }
    }
  }
}`;
exports.createCommittedDateQuery = createCommittedDateQuery;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.query = void 0;
async function query(query) {
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `bearer ${process.env.GH_TOKEN}`,
        },
        body: JSON.stringify({ query }).replace(/\\n/g, ""),
    });
    return res.json();
}
exports.query = query;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateUpdatedBox = void 0;
async function generateUpdatedBox() {
    return `Last Updated on ${new Date().toUTCString()}`;
}
exports.generateUpdatedBox = generateUpdatedBox;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateWakaBox = void 0;
const generateBarChart_1 = __importDefault(__webpack_require__(7));
const strings_1 = __webpack_require__(5);
const wakatime_1 = __webpack_require__(12);
const BOX_TITLE = strings_1.strings.boxs["waka-box"].title;
async function generateWakaBox({ WakatimeApiKey }) {
    const data = await (0, wakatime_1.getStats)({ WakatimeApiKey });
    const stats = {
        categories: data?.categories || [],
        editors: data?.editors || [],
        languages: data?.languages?.slice(0, 5) || [],
        operatingSystems: data?.operating_systems || [],
    };
    const lines = stats.languages
        .map(({ name, text, percent }, index) => {
        const line = [
            `${index + 1} ${name}`.padEnd(12),
            text.padEnd(14),
            (0, generateBarChart_1.default)(percent, 21),
            percent.toFixed(1).padStart(5) + "%",
        ].join(" ");
        return line;
    })
        .join("\n"); // log({ lines });
    const full_string = [BOX_TITLE, `\`\`\`text\n${lines}\n\`\`\``].join("\n");
    return full_string;
}
exports.generateWakaBox = generateWakaBox;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(13), exports);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStats = void 0;
async function getStats({ WakatimeApiKey, }) {
    const res = await fetch(`https://wakatime.com/api/v1/users/current/stats?api_key=${WakatimeApiKey}`)
        .then((res) => res.json())
        .catch((err) => {
        console.error(err);
    });
    return res.data;
}
exports.getStats = getStats;


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(15), exports);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserData = void 0;
const queries_1 = __webpack_require__(8);
const query_1 = __webpack_require__(9);
async function getUserData() {
    const userResponse = await (0, query_1.query)(queries_1.userInfoQuery).catch((error) => console.error(`Unable to get username and id\n${error}`));
    const { login: username, id, ...rest } = userResponse?.data?.viewer;
    return { username, id, ...rest };
}
exports.getUserData = getUserData;


/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(17)
const path = __webpack_require__(18)
const os = __webpack_require__(19)
const packageJson = __webpack_require__(20)

const version = packageJson.version

const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

// Parser src into an Object
function parse (src) {
  const obj = {}

  // Convert buffer to string
  let lines = src.toString()

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/mg, '\n')

  let match
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]

    // Default undefined or null to empty string
    let value = (match[2] || '')

    // Remove whitespace
    value = value.trim()

    // Check if double quoted
    const maybeQuote = value[0]

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // Add to object
    obj[key] = value
  }

  return obj
}

function _log (message) {
  console.log(`[dotenv@${version}][DEBUG] ${message}`)
}

function _resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  const debug = Boolean(options && options.debug)
  const override = Boolean(options && options.override)

  if (options) {
    if (options.path != null) {
      dotenvPath = _resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
  }

  try {
    // Specifying an encoding returns a string instead of a buffer
    const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }))

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else {
        if (override === true) {
          process.env[key] = parsed[key]
        }

        if (debug) {
          if (override === true) {
            _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`)
          } else {
            _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`)
          }
        }
      }
    })

    return { parsed }
  } catch (e) {
    if (debug) {
      _log(`Failed to load ${dotenvPath} ${e.message}`)
    }

    return { error: e }
  }
}

const DotenvModule = {
  config,
  parse
}

module.exports.config = DotenvModule.config
module.exports.parse = DotenvModule.parse
module.exports = DotenvModule


/***/ }),
/* 17 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 18 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"dotenv","version":"16.0.3","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"require":"./lib/main.js","types":"./lib/main.d.ts","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","lint-readme":"standard-markdown","pretest":"npm run lint && npm run dts-check","test":"tap tests/*.js --100 -Rspec","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@types/node":"^17.0.9","decache":"^4.6.1","dtslint":"^3.7.0","sinon":"^12.0.1","standard":"^16.0.4","standard-markdown":"^7.1.0","standard-version":"^9.3.2","tap":"^15.1.6","tar":"^6.1.11","typescript":"^4.5.4"},"engines":{"node":">=12"}}');

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;