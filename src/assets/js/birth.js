import List from "list.js";

class Birth {

  constructor(id, persons) {
    this.id = id;
    this.valueNames = ["name", "rus", { name: "iso", attr: "data-iso" }];
    this.searchColumns = ["name"];
    this.listItem = `<div class="flex justify-between py-4 border-b border-gray-600"><div class="name shrink"></div><div class="rus iso shrink-0"></div></div>`;
    this.paginationItem = `<li class="group"><a class="page w-10 h-10 bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white group-[.active]:bg-blue-800 group-[.active]:text-gray-200 p-4 inline-flex items-center text-sm font-medium rounded-full transition-all" href="#"></a></li>`;
    this.paginationInner = 1;
    this.paginationOuter = 1;
    this.pageItems = 10;
    this.emptyDay = "В этот день никто не родился";
    this.emptyWeek = "В ближайшие дни никто не родился";
    this.emptyMonth = "В этом месяце никто не родился";
    this.list = new List(this.id, this.getOptions(), this.filterPersons(persons));
  }

  getOptions = () => {
    const options = {
      valueNames: this.valueNames,
      searchColumns: this.searchColumns,
      item: this.listItem,
    }
    if (this.id === "all") {
      options.pagination = {
        item: this.paginationItem,
        innerWindow: this.paginationInner,
        outerWindow: this.paginationOuter,
      };
      options.page = this.pageItems;
    }
    return options;
  }

  filterPersons = (persons) => {
    switch (this.id) {
      case "day":
        return this.currentDay(persons);
      case "soon":
        return this.nextWeek(persons);
      case "month":
        return this.currentMonth(persons);
      default:
        return this.sortByName(persons);
    }
  }

  currentDay = (persons) => {
    const now = new Date();
    const birth = getDateFormat(now, "iso", "birth");
    let filtered = persons.filter(person => person.birth === birth);
    if (filtered.length) {
      filtered = this.sortByName(filtered);
    } else {
      const rus = getDateFormat(now, "rus", "birth");
      filtered = [{ name: this.emptyDay, rus: rus }];
    }
    return filtered;
  }

  nextWeek = (persons) => {
    const min = new Date();
    min.setDate(min.getDate() + 1);
    const from = getDateFormat(min, "iso", "birth");
    const max = new Date();
    max.setDate(max.getDate() + 7);
    const to = getDateFormat(max, "iso", "birth");
    let filtered = persons.filter(person => person.birth >= from && person.birth <= to);
    if (filtered.length) {
      filtered = this.sortByBirth(filtered);
    } else {
      const rus = getDateFormat(min, "rus", "birth") + " - " + getDateFormat(max, "rus", "birth");
      filtered = [{ name: this.emptyWeek, rus: rus }];
    }
    return filtered;
  }

  currentMonth = (persons) => {
    const now = new Date();
    const month = getDateFormat(now, "iso", "month");
    let filtered = persons.filter(person => person.month === month);
    if (filtered.length) {
      filtered = this.sortByBirth(filtered);
    } else {
      const rus = getDateFormat(now, "rus", "month");
      filtered = [{ name: this.emptyMonth, rus: rus }];
    }
    return filtered;
  }

  sortByName = (persons) => {
    return persons.sort((a, b) => {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      else return 0;
    });
  }

  sortByBirth = (persons) => {
    return persons.sort((a, b) => {
      if (a.birth > b.birth) return 1;
      else if (a.birth < b.birth) return -1;
      else return 0;
    });
  }

}

function getPersons(text) {
  const rows = text.split("\r\n");
  const persons = rows.map((row) => {
    const fields = row.split(",");
    const dmy = fields[1].split(".");
    const date = new Date(Number(dmy[2]), Number(dmy[1]) - 1, Number(dmy[0]));
    if (isNaN(date.getTime())) return false;
    const name = fields[0];
    const rus = getDateFormat(date, "rus");
    const iso = getDateFormat(date, "iso");
    const birth = getDateFormat(date, "iso", "birth");
    const month = getDateFormat(date, "iso", "month");
    return { name: name, rus: rus, iso: iso, birth: birth, month: month };
  });
  return persons.filter(person => person);
}

function getDateFormat(date, format = "rus", part = "full") {
  if (format == "iso") {
    let parts;
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    switch (part) {
      case "birth":
        parts = [month, day];
        break;
      case "month":
        parts = [month];
        break;
      default:
        parts = [year, month, day];
    }
    return parts.join("-");
  } else {
    let options;
    switch (part) {
      case "birth":
        options = { day: "numeric", month: "short" };
        break;
      case "month":
        options = { month: "long" };
        break;
      default:
        options = { day: "numeric", month: "short", year: "numeric" };
    }
    return date.toLocaleDateString("ru-RU", options);
  }
}

fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT_Aywj-d6NZ0rp5LZS66WR6-ex_HH9Fkp9xx9nhPwI1LGA1OwR2Mmg90dUUttFByBl91NoVDcYghqh/pub?gid=0&single=true&output=csv")
  .then(response => response.text())
  .then(text => {
    const persons = getPersons(text);
    const day = new Birth("day", persons);
    const soon = new Birth("soon", persons);
    const month = new Birth("month", persons);
    const all = new Birth("all", persons);
  });
