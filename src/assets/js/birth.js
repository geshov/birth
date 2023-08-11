import List from "list.js";

class Birth {

  constructor(id, persons) {
    this.id = id;
    this.emptyDay = "В этот день никто не родился";
    this.emptyMonth = "В этом месяце никто не родился";
    this.list = new List(this.id, this.getOptions(), this.filterPersons(persons));
  }

  getOptions = () => {
    if (this.id === "all") {
      return {
        valueNames: ["name", "birth"],
        item: `<div class="flex justify-between py-3 border-b">
          <div class="name"></div>
          <div class="birth"></div>
        </div>`,
        page: 10,
        pagination: {
          item: `<li class="group"><a class="page w-10 h-10 bg-gray-200 text-gray-800 hover:bg-blue-200 group-[.active]:bg-blue-500 group-[.active]:text-white p-4 inline-flex items-center text-sm font-medium rounded-full" href="#"></a></li>`,
        },
      }
    } else {
      return {
        valueNames: ["name", "birth"],
        item: `<div class="flex justify-between py-3 border-b">
          <div class="name"></div>
          <div class="birth"></div>
        </div>`,
      }
    }
  }

  filterPersons = (persons) => {
    let filtered;
    switch (this.id) {
      case "day":
        filtered = persons.filter(this.currentDay);
        if (!filtered.length) filtered = [{ name: this.emptyDay, birth: "" }];
        break;
      case "month":
        filtered = persons.filter(this.currentMonth);
        if (!filtered.length) filtered = [{ name: this.emptyMonth, birth: "" }];
        else filtered = this.sortByBirth(filtered);
        break;
      default:
        filtered = persons;
    }
    return filtered;
  }

  sortByBirth = (persons) => {
    return persons.sort((a, b) => {
      if (a.birth > b.birth) return 1;
      else if (a.birth < b.birth) return -1;
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
    const birthParts = person.birth.split(".");
    const birthMonth = parseInt(birthParts[1]);
    const birthDay = parseInt(birthParts[0]);
    const birthOffset = birthMonth * 100 + birthDay;
    const nowDate = new Date();
    const nowMonth = nowDate.getMonth() + 1;
    const nowDay = nowDate.getDate();
    const nowOffset = nowMonth * 100 + nowDay;
    return birthOffset === nowOffset;
  }

  currentMonth = (person) => {
    const birthParts = person.birth.split(".");
    const birthMonth = parseInt(birthParts[1]);
    const nowDate = new Date();
    const nowMonth = nowDate.getMonth() + 1;
    return birthMonth === nowMonth;
  }

}

fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vT-5j3rZHVbVl3fdH6Up-V_eRkb35Qb6Hev1cY0FQgi6RKGrinIiJdDkBno-XxPHMpKO_3MK6Npwakb/pub?gid=0&single=true&output=csv")
  .then(response => response.text())
  .then(text => {
    const rows = text.split("\r\n");
    const persons = rows.map((row) => {
      const fields = row.split(",");
      return { name: fields[0], birth: fields[1] };
    });
    const day = new Birth("day", persons);
    const month = new Birth("month", persons);
    const all = new Birth("all", persons);
  });
