import tkinter as tk
from tkinter import messagebox
import requests

API_URL = "https://pokeapi.co/api/v2/pokemon/"
WARNA_DEFAULT = "#A8A878"

# =====================================================
# BAGIAN OOP
# =====================================================

class Pokemon:
    def __init__(self, poke_id, name, hp, attack, defense, types, sprite_bytes):
        self.poke_id = poke_id
        self.name = name
        self.__hp = hp                 # encapsulation
        self.max_hp = hp
        self.attack = attack
        self.defense = defense
        self.types = types
        self.sprite_bytes = sprite_bytes

    def get_hp(self):
        return self.__hp

    def ringkasan(self):
        # abstraction: sembunyikan detail dict JSON, tampilkan info penting saja
        tipe_str = ", ".join(t.capitalize() for t in self.types)
        return (f"#{self.poke_id} {self.name.capitalize()}\n"
                f"Tipe: {tipe_str}\n"
                f"HP: {self.get_hp()}  ATK: {self.attack}  DEF: {self.defense}")

    def warna_badge(self):
        return WARNA_DEFAULT

    def jargon(self):
        return "Pokemon tipe umum."


class FireType(Pokemon):
    def warna_badge(self):
        return "#F08030"

    def jargon(self):
        return "Kuat lawan tipe Grass, lemah lawan tipe Water."


class WaterType(Pokemon):
    def warna_badge(self):
        return "#6890F0"

    def jargon(self):
        return "Kuat lawan tipe Fire, lemah lawan Grass & Electric."


class GrassType(Pokemon):
    def warna_badge(self):
        return "#78C850"

    def jargon(self):
        return "Kuat lawan tipe Water, lemah lawan tipe Fire."


class ElectricType(Pokemon):
    def warna_badge(self):
        return "#F8D030"

    def jargon(self):
        return "Kuat lawan tipe Water, lemah lawan tipe Ground."


TIPE_KE_CLASS = {
    "fire": FireType,
    "water": WaterType,
    "grass": GrassType,
    "electric": ElectricType,
}


def buat_pokemon_dari_json(data):
    tipe_utama = data["types"][0]["type"]["name"]
    ClassTerpilih = TIPE_KE_CLASS.get(tipe_utama, Pokemon)

    stats = {s["stat"]["name"]: s["base_stat"] for s in data["stats"]}
    sprite_url = data["sprites"]["front_default"]
    sprite_bytes = None
    if sprite_url:
        img_response = requests.get(sprite_url, timeout=10)
        sprite_bytes = img_response.content

    return ClassTerpilih(
        poke_id=data["id"],
        name=data["name"],
        hp=stats.get("hp", 50),
        attack=stats.get("attack", 50),
        defense=stats.get("defense", 50),
        types=[t["type"]["name"] for t in data["types"]],
        sprite_bytes=sprite_bytes,
    )


# =====================================================
# BAGIAN APLIKASI (GUI)
# =====================================================

class PokedexApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Pokedex Explorer")
        self.root.geometry("380x580")
        self.root.configure(bg="#f0f0f0")
        self.team = []
        self.pokemon_sekarang = None
        self._image_ref = None

        search_frame = tk.Frame(root, bg="#f0f0f0")
        search_frame.pack(pady=10)
        self.entry = tk.Entry(search_frame, font=("Arial", 14), width=18)
        self.entry.pack(side="left", padx=5)
        self.entry.bind("<Return>", lambda e: self.cari_pokemon())
        tk.Button(search_frame, text="Cari", font=("Arial", 12), command=self.cari_pokemon).pack(side="left")

        self.card = tk.Frame(root, bg="white", bd=2, relief="groove")
        self.card.pack(pady=10, padx=20, fill="x")

        self.sprite_label = tk.Label(self.card, bg="white")
        self.sprite_label.pack(pady=10)

        self.badge_label = tk.Label(self.card, text="", font=("Arial", 12, "bold"),
                                     fg="white", padx=10, pady=4)
        self.badge_label.pack(pady=5)

        self.info_label = tk.Label(self.card, text="Cari nama Pokemon di atas!",
                                    font=("Arial", 11), justify="left", bg="white")
        self.info_label.pack(pady=5)

        self.jargon_label = tk.Label(self.card, text="", font=("Arial", 10, "italic"),
                                      wraplength=300, bg="white", fg="#555")
        self.jargon_label.pack(pady=5)

        tk.Button(self.card, text="+ Tambah ke Tim", command=self.tambah_ke_tim).pack(pady=10)

        tk.Label(root, text="Tim Kamu:", font=("Arial", 12, "bold"), bg="#f0f0f0").pack()
        self.team_listbox = tk.Listbox(root, height=6, font=("Arial", 11))
        self.team_listbox.pack(pady=5, padx=20, fill="x")

    def cari_pokemon(self):
        nama = self.entry.get().strip().lower()
        if not nama:
            return
        try:
            response = requests.get(f"{API_URL}{nama}", timeout=10)
            if response.status_code != 200:
                messagebox.showerror("Tidak ditemukan", f"Pokemon '{nama}' tidak ditemukan.")
                return
            data = response.json()
            pokemon = buat_pokemon_dari_json(data)
            self.tampilkan_pokemon(pokemon)
        except requests.exceptions.RequestException:
            messagebox.showerror("Error", "Gagal terhubung ke internet / API.")

    def tampilkan_pokemon(self, pokemon):
        self.pokemon_sekarang = pokemon

        if pokemon.sprite_bytes:
            self._image_ref = tk.PhotoImage(data=pokemon.sprite_bytes)
            self.sprite_label.config(image=self._image_ref, text="")
        else:
            self.sprite_label.config(image="", text="(gambar tidak tersedia)")

        # Polymorphism: warna_badge() dan jargon() beda tiap subclass,
        # tapi dipanggil dengan cara yang sama tanpa perlu tahu subclass-nya
        self.badge_label.config(text=", ".join(t.upper() for t in pokemon.types),
                                 bg=pokemon.warna_badge())
        self.info_label.config(text=pokemon.ringkasan())
        self.jargon_label.config(text=pokemon.jargon())

    def tambah_ke_tim(self):
        if self.pokemon_sekarang is None:
            return
        self.team.append(self.pokemon_sekarang)
        label = f"#{self.pokemon_sekarang.poke_id} {self.pokemon_sekarang.name.capitalize()}"
        self.team_listbox.insert("end", label)


if __name__ == "__main__":
    root = tk.Tk()
    app = PokedexApp(root)
    root.mainloop()