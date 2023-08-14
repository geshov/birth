import List from "list.js";

class Birth {

  constructor(id, persons) {
    this.id = id;
    this.valueNames = ["name", "birth", { name: "iso", attr: "data-iso" }];
    this.searchColumns = ["name"];
    this.listItem = `<div class="flex justify-between py-4 border-b border-gray-600"><div class="name"></div><div class="birth iso"></div></div>`;
    this.paginationItem = `<li class="group"><a class="page w-10 h-10 bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white group-[.active]:bg-blue-800 group-[.active]:text-gray-200 p-4 inline-flex items-center text-sm font-medium rounded-full transition-all" href="#"></a></li>`;
    this.paginationInner = 1;
    this.paginationOuter = 1;
    this.pageItems = 10;
    this.emptyDay = "В этот день никто не родился";
    this.emptyWeek = "В ближайшую неделю никто не родился";
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
    let filtered;
    switch (this.id) {
      case "day":
        filtered = persons.filter(this.currentDay);
        if (!filtered.length) filtered = [{ name: this.emptyDay, birth: "" }];
        else filtered = this.sortByName(filtered);
        break;
      case "soon":
        filtered = persons.filter(this.nextWeek);
        if (!filtered.length) filtered = [{ name: this.emptyWeek, birth: "" }];
        else filtered = this.sortByBirtn(filtered);
        break;
      case "month":
        filtered = persons.filter(this.currentMonth);
        if (!filtered.length) filtered = [{ name: this.emptyMonth, birth: "" }];
        else filtered = this.sortByBirtn(filtered);
        break;
      default:
        filtered = this.sortByName(persons);
    }
    return filtered;
  }

  sortByBirtn = (persons) => {
    return persons.sort((a, b) => {
      const aa = a.date.getMonth() * 100 + a.date.getDate();
      const bb = b.date.getMonth() * 100 + b.date.getDate();
      if (aa > bb) return 1;
      else if (aa < bb) return -1;
      else return 0;
    });
  }

  sortByName = (persons) => {
    return persons.sort((a, b) => {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      else return 0;
    });
  }

  currentDay = (person) => {
    const now = new Date();
    return person.date.getDate() === now.getDate() && person.date.getMonth() === now.getMonth();
  }

  nextWeek = (person) => {
    const birth = person.date.getMonth() * 100 + person.date.getDate();
    const date = new Date();
    const now = date.getMonth() * 100 + date.getDate();
    date.setDate(date.getDate() + 8);
    const week = date.getMonth() * 100 + date.getDate();
    return (birth > now) && (birth < week);
  }

  currentMonth = (person) => {
    const now = new Date();
    return person.date.getMonth() === now.getMonth();
  }

}

function getPersons(text) {
  const rows = text.split("\r\n");
  return rows.map((row) => {
    const fields = row.split(",");
    const name = fields[0];
    const dmy = fields[1].split(".");
    const date = new Date(Number(dmy[2]), Number(dmy[1]) - 1, Number(dmy[0]));
    const iso = date.toISOString();
    const birth = date.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
    return { name: name, birth: birth, date: date, iso: iso };
  });
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
